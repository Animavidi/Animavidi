"""Prepare internal prototype SVG assets from the supplied Illustrator export.

The script deliberately does not infer semantic road, river, or boundary layers
from colour alone. It only extracts text whose source coordinates and wording
provide direct evidence for a category.
"""

from __future__ import annotations

import copy
import json
import re
import unicodedata
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "src" / "assets" / "maps" / "kruger"
MASTER = ASSET_DIR / "Kruger_Master.svg"
VIEW_BOX = "1025 275 1025 3500"
SVG_NS = "http://www.w3.org/2000/svg"
XLINK_NS = "http://www.w3.org/1999/xlink"
ET.register_namespace("", SVG_NS)
ET.register_namespace("xlink", XLINK_NS)
Q = f"{{{SVG_NS}}}"

PALETTE_REPLACEMENTS = {
    "#fff200": "#B78C45",
    "#fceb5c": "#B78C45",
    "#f6c428": "#B78C45",
    "#d71920": "#B78C45",
    "#b9252e": "#B78C45",
    "#be1622": "#B78C45",
    "#e93e2e": "#B78C45",
    "#00aeef": "#6F938D",
    "#36a9e1": "#6F938D",
    "#006db7": "#6F938D",
    "#00a8de": "#6F938D",
    "#80d2f6": "#9EB8B0",
    "#8fa82e": "#526B57",
    "#007073": "#1E3328",
    "#323d8d": "#1E3328",
    "#1d1d1b": "#1E3328",
    "#000000": "#1E3328",
    "#000": "#1E3328",
    "#ffffff": "#F6F3EC",
    "#fff": "#F6F3EC",
}

CATEGORIES = {
    "camps": ("camp",),
    "gates": ("gate", "border post"),
    "hides": ("hide",),
    "picnic": ("picnic",),
    "viewpoints": ("lookout", "viewpoint"),
    "waterholes": ("dam", "waterhole", " pan", "pan ", "lake panic"),
}


def root_svg(title: str, description: str, category: str) -> ET.Element:
    root = ET.Element(
        Q + "svg",
        {
            "viewBox": VIEW_BOX,
            "role": "img",
            "aria-labelledby": f"{category}-title {category}-description",
            "data-prototype-only": "true",
            "data-map-category": category,
        },
    )
    ET.SubElement(root, Q + "title", {"id": f"{category}-title"}).text = title
    ET.SubElement(root, Q + "desc", {"id": f"{category}-description"}).text = description
    return root


def write_svg(root: ET.Element, name: str) -> None:
    ET.indent(root, space="  ")
    ET.ElementTree(root).write(ASSET_DIR / name, encoding="utf-8", xml_declaration=True)


def slug(value: str) -> str:
    normal = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", normal.lower()).strip("-") or "feature"


def text_content(element: ET.Element) -> str:
    return " ".join("".join(element.itertext()).split())


def coordinate(element: ET.Element) -> tuple[float, float] | None:
    match = re.search(r"translate\(\s*([-\d.]+)[ ,]+([-\d.]+)", element.get("transform", ""))
    return tuple(map(float, match.groups())) if match else None


def in_crop(element: ET.Element) -> bool:
    point = coordinate(element)
    return bool(point and 1025 <= point[0] <= 2050 and 275 <= point[1] <= 3775)


def classify(label: str) -> str | None:
    lowered = f" {label.lower()} "
    for category, terms in CATEGORIES.items():
        if any(term in lowered for term in terms):
            return category
    return None


def replace_palette(element: ET.Element) -> None:
    for node in element.iter():
        if node.tag == Q + "style" and node.text:
            text = node.text
            for source, target in PALETTE_REPLACEMENTS.items():
                text = re.sub(re.escape(source), target, text, flags=re.IGNORECASE)
            node.text = text


def remove_raster_images(element: ET.Element) -> int:
    removed = 0
    for parent in element.iter():
        for child in list(parent):
            if child.tag == Q + "image":
                parent.remove(child)
                removed += 1
    return removed


def add_source_defs(target: ET.Element, source: ET.Element) -> None:
    defs = source.find(Q + "defs")
    if defs is None:
        return
    compact_defs = ET.Element(Q + "defs")
    for style in defs.iter(Q + "style"):
        compact_defs.append(copy.deepcopy(style))
    replace_palette(compact_defs)
    if len(compact_defs):
        target.append(compact_defs)


def main() -> None:
    source = ET.parse(MASTER).getroot()
    counts: dict[str, int] = {}

    base = root_svg(
        "Kruger prototype base map",
        "Internal prototype crop derived from the supplied Kruger master artwork. Not for navigation or publication.",
        "base",
    )
    source_defs = source.find(Q + "defs")
    if source_defs is not None:
        full_defs = copy.deepcopy(source_defs)
        remove_raster_images(full_defs)
        replace_palette(full_defs)
        base.append(full_defs)
    for child in source:
        if child.tag in {Q + "defs", Q + "title", Q + "desc"}:
            continue
        copied = copy.deepcopy(child)
        remove_raster_images(copied)
        replace_palette(copied)
        base.append(copied)
    write_svg(base, "kruger-base.svg")
    counts["base"] = sum(1 for _ in base.iter()) - 1

    extracted: dict[str, list[ET.Element]] = {key: [] for key in CATEGORIES}
    all_labels: list[ET.Element] = []
    used_ids: dict[str, int] = {}
    for element in source.iter(Q + "text"):
        if not in_crop(element):
            continue
        label = text_content(element)
        if not label:
            continue
        copied = copy.deepcopy(element)
        base_id = slug(label)
        used_ids[base_id] = used_ids.get(base_id, 0) + 1
        copied.set("id", f"kruger-label-{base_id}-{used_ids[base_id]}")
        copied.set("data-map-category", "label")
        copied.set("data-source-label", label)
        all_labels.append(copied)
        category = classify(label)
        if category:
            category_copy = copy.deepcopy(copied)
            category_copy.set("id", category_copy.get("id", "").replace("kruger-label", f"kruger-{category}"))
            category_copy.set("data-map-category", category)
            category_copy.set("data-representation", "source-label-only")
            extracted[category].append(category_copy)

    labels = root_svg(
        "Kruger source labels",
        "Geographically positioned labels extracted directly from the supplied artwork. Labels may include cartographic context outside the park.",
        "labels",
    )
    add_source_defs(labels, source)
    label_group = ET.SubElement(labels, Q + "g", {"id": "kruger-labels-layer", "data-map-category": "labels"})
    label_group.extend(all_labels)
    write_svg(labels, "kruger-labels.svg")
    counts["labels"] = len(all_labels)

    descriptions = {
        "camps": "Source text explicitly containing camp terminology; no unverified camp symbols are included.",
        "gates": "Source text explicitly containing gate or border-post terminology; no unverified gate symbols are included.",
        "hides": "Source text explicitly containing hide terminology; no unverified hide symbols are included.",
        "picnic": "Source text explicitly containing picnic terminology; no unverified picnic symbols are included.",
        "viewpoints": "Source text explicitly containing lookout or viewpoint terminology; no unverified viewpoint symbols are included.",
        "waterholes": "Source text explicitly naming dams, pans or waterholes; no unverified water symbols are included.",
    }
    for category, elements in extracted.items():
        layer = root_svg(f"Kruger {category}", descriptions[category], category)
        add_source_defs(layer, source)
        group = ET.SubElement(
            layer,
            Q + "g",
            {
                "id": f"kruger-{category}-layer",
                "data-map-category": category,
                "data-representation": "source-label-only",
            },
        )
        group.extend(elements)
        write_svg(layer, f"kruger-{category}.svg")
        counts[category] = len(elements)

    unresolved = {
        "boundary": "The Illustrator export has no semantic park-boundary group and colour alone is insufficient evidence.",
        "roads-tar": "Tar-road geometry cannot be distinguished reliably from other linework without source layer metadata.",
        "roads-gravel": "Gravel-road geometry cannot be distinguished reliably from other linework without source layer metadata.",
        "rivers": "River geometry cannot be distinguished reliably from other blue linework without source layer metadata.",
    }
    for category, reason in unresolved.items():
        layer = root_svg(f"Kruger {category}", f"Intentional empty prototype layer. {reason}", category)
        ET.SubElement(
            layer,
            Q + "g",
            {
                "id": f"kruger-{category}-layer",
                "data-map-category": category,
                "data-availability": "unresolved",
            },
        )
        write_svg(layer, f"kruger-{category}.svg")
        counts[category] = 0

    (ASSET_DIR / "kruger-preparation-report.json").write_text(
        json.dumps(
            {
                "sourceViewBox": source.get("viewBox"),
                "sharedViewBox": VIEW_BOX,
                "masterElementCount": sum(1 for _ in source.iter()) - 1,
                "removedRasterImagesFromBase": sum(1 for node in source.iter() if node.tag == Q + "image"),
                "layerFeatureCounts": counts,
                "unresolvedLayers": unresolved,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
