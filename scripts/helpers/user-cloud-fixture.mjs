import {DatabaseSync} from 'node:sqlite'
import {readFileSync,readdirSync} from 'node:fs'
export function testEnvironment(){
  const sqlite=new DatabaseSync(':memory:');sqlite.exec('PRAGMA foreign_keys=ON')
  for(const name of readdirSync(new URL('../../worker/migrations/',import.meta.url)).filter(name=>name.endsWith('.sql')).sort())sqlite.exec(readFileSync(new URL('../../worker/migrations/'+name,import.meta.url),'utf8'))
  const database={
    prepare(sql){
      const statement=sqlite.prepare(sql);let args=[]
      return {
        bind(...values){args=values;return this},
        async first(){return statement.get(...args)??null},
        async all(){return {results:statement.all(...args),success:true,meta:{}}},
        async raw(){statement.setReturnArrays(true);return statement.all(...args)},
        async run(){const result=statement.run(...args);return {success:true,meta:{changes:Number(result.changes),last_row_id:Number(result.lastInsertRowid)},results:[]}}
      }
    },
    async batch(statements){return Promise.all(statements.map(statement=>statement.all()))}
  }

  const objects=new Map(),mail=[]
  const bucket={async head(key){const object=objects.get(key);return object?{size:object.bytes.length}:null},async get(key){const object=objects.get(key);return object?{body:object.bytes,httpMetadata:object.httpMetadata}:null},async put(key,bytes,options={}){const value=bytes instanceof ReadableStream?new Uint8Array(await new Response(bytes).arrayBuffer()):new Uint8Array(bytes);objects.set(key,{bytes:value,...options});return{key}},async delete(keys){for(const key of Array.isArray(keys)?keys:[keys])objects.delete(key)},async list({prefix=''}){return{objects:[...objects.keys()].filter(key=>key.startsWith(prefix)).map(key=>({key})),truncated:false}}}
  return{sqlite,mail,objects,env:{CONTENT_DB:database,MAMMAL_PHOTOS:bucket,BETTER_AUTH_SECRET:'test-only-32-byte-secret-not-used-by-a-deployed-worker',AUTH_EMAIL_FROM:'test@animavidi.invalid',EMAIL:{async send(message){mail.push(message);return{}}}}}
}
