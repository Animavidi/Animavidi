import { personalKeys } from '../model/cloud'
let activeUserId:string|undefined
let activeName:string|undefined
let activeSince:string|undefined
export const currentUserId=()=>activeUserId
export function setActiveUserId(id:string|undefined,name?:string,createdAt?:string){activeUserId=id;activeName=name;activeSince=createdAt?.slice(0,4)}
export const currentUserName=()=>activeName
export const currentUserSince=()=>activeSince
const scoped=(key:string)=>activeUserId?`animavidi:user:${activeUserId}:${key}`:null
export const personalStorage={
  getItem(key:string){const name=scoped(key);return name?localStorage.getItem(name):null},
  setItem(key:string,value:string){const name=scoped(key);if(!name)throw new Error('Sign in before saving personal settings.');localStorage.setItem(name,value);if(!personalKeys.includes(key as typeof personalKeys[number]))return;window.dispatchEvent(new CustomEvent('animavidi:preference',{detail:{key,value,userId:activeUserId}}))},
  apply(key:string,value:string,userId:string){if(activeUserId===userId)localStorage.setItem(`animavidi:user:${userId}:${key}`,value)},
  entries(){return Object.fromEntries(personalKeys.map(key=>[key,this.getItem(key)]))},
}
