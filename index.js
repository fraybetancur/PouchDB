require('dotenv').config()
// Load the Cloudant library.
const Cloudant = require('@cloudant/cloudant')
// Initialize Cloudant with settings from .env
const cloudant = new Cloudant({
  url: process.env.CLOUDANT_URL,
  account: process.env.CLOUDANT_ACCOUNT,
  password: process.env.CLOUDANT_PASSWORD
})

//Load the PouchDB library
const PouchDB = require('pouchdb');

const remotedb = new PouchDB(`${process.env.CLOUDANT_URL}/test`)
console.log('Remote database created Successfully.');
const localDB = new PouchDB('myLocalDB', { skip_setup: true });
console.log('Local database created Successfully.');

//sync remotedb and localDB
localDB.sync(remotedb)


const dummyData={
  title: "Cloudant class",
  dateAdded: new Date().toDateString(),
  numberOfStudent: 10
}

//create function populateData
async function populateData() {
  const data = dummyData;
  return cloudant.use('test').insert(data);
}

//call populateData funcion
populateData().then((data) => {
  console.log(data); // { ok: true, id: 'dd3..', ...
}).catch((err) => {
  console.log(err);
});

//log data in localBD to compare with remotedb
// localDB.info().then(function (info) {
//   // console.log("LOCALDB: ")
//   console.log("LOCALDB: ", info);
// })
// remotedb.info().then(function (info) {
//   console.log("REMOTE_DB: ",info);
// })

localDB.allDocs({
    include_docs: true,
    attachments: true
  }).then(function (result) {
    console.log("FIRST DOC IN LOCAL title: ", result.rows[0].doc.title)
  }).catch(function (err) {
    console.log(err);
  });
