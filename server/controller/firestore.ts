import { Request, Response, NextFunction } from 'express'
import * as admin from 'firebase-admin'
import FirebaseFirestore from '@google-cloud/firestore'

type Field = { name: string; type: number; value: any }

type DocumentData = Field[]

type Document = {
  data: DocumentData
  collections: string[]
}

type Documents = {
  [key: string]: Document
}

type Collections = {
  [key: string]: Documents
}

export class FirestoreController {
  constructor(private db: FirebaseFirestore.Firestore) {}

  getCollections = async (req: Request, res: Response, _next: NextFunction) => {
    let collections: FirebaseFirestore.CollectionReference[] = []
    if (req.query.paths == null || req.query.paths.length === 0) {
      collections = await this.db.listCollections()
    } else {
      collections = await this.db
        .doc(req.query.paths.join('/'))
        .listCollections()
    }
    res.send(await this.filterExistCollectionIds(collections))
  }

  getDocuments = async (req: Request, res: Response, _next: NextFunction) => {
    const filter = req.query.filter
    let query:
      | FirebaseFirestore.CollectionReference
      | FirebaseFirestore.Query = this.db.collection(req.query.paths.join('/'))

    if (filter) {
      const persedFilter = JSON.parse(filter)
      let searchField = this.toField(
        persedFilter.fieldList[0].value,
        persedFilter.fieldList[0].type
      )
      if (
        persedFilter.condition === 'in' ||
        persedFilter.condition === 'array-contains-any'
      ) {
        searchField = persedFilter.fieldList.map((field: any) =>
          this.toField(field.value, field.type)
        )
      }
      query = query.where(
        persedFilter.fieldName,
        persedFilter.condition,
        searchField
      )
      if (persedFilter.order !== '') {
        query = query.orderBy(persedFilter.fieldName, persedFilter.order)
      }
    }

    const snapshots = await query.get()
    const docs: Documents = {}
    for (const doc of snapshots.docs) {
      const documentData: DocumentData = []
      const data = doc.data()
      for (const field in data) {
        documentData.push(this.getField(field, data[field]))
      }
      docs[doc.id] = {
        data: documentData,
        collections: await this.filterExistCollectionIds(
          await doc.ref.listCollections()
        )
      }
    }
    res.send(docs)
  }

  getDocument = async (req: Request, res: Response, _next: NextFunction) => {
    const doc = await this.db.doc(req.query.paths.join('/')).get()

    const documentData: DocumentData = []
    const data = doc.data()
    for (const field in data) {
      documentData.push(this.getField(field, data[field]))
    }
    const document: Document = {
      data: documentData,
      collections: await this.filterExistCollectionIds(
        await doc.ref.listCollections()
      )
    }
    res.send(document)
  }

  filterExistCollectionIds = async (
    cols: FirebaseFirestore.CollectionReference[]
  ): Promise<string[]> => {
    const ids: string[] = []
    for (const col of cols) {
      if ((await col.limit(1).get()).size > 0) {
        ids.push(col.id)
      }
    }
    return ids
  }

  updateDocument = async (req: Request, res: Response, _next: NextFunction) => {
    const data: FirebaseFirestore.UpdateData = {}

    data[req.body.data.name] = this.toField(
      req.body.data.value,
      req.body.data.type
    )
    await this.db.doc(req.body.paths.join('/')).update(data)
    res.end()
  }

  deleteDocumentField = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const data: FirebaseFirestore.UpdateData = {}
    data[req.body.name] = admin.firestore.FieldValue.delete()
    await this.db.doc(req.body.paths.join('/')).update(data)
    res.end()
  }

  addDocument = async (req: Request, res: Response, _next: NextFunction) => {
    const data: FirebaseFirestore.DocumentData = {}
    for (const field of req.body.data) {
      data[field.name] = this.toField(field.value, field.type)
    }
    const collection = this.db.collection(req.body.paths.join('/'))
    if (req.body.documentId !== '') {
      await collection.doc(req.body.documentId).create(data)
      res.end()
      return
    }
    await collection.add(data)
    res.end()
  }

  deleteDocumentAllField = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const docRef = this.db.doc(req.body.paths.join('/'))

    await this.db.runTransaction(async (t) => {
      const doc = await t.get(docRef)
      const data: FirebaseFirestore.UpdateData = {}
      for (const field in doc.data()) {
        data[field] = admin.firestore.FieldValue.delete()
      }
      t.update(docRef, data)
    })
    res.end()
  }

  arrayChunk = (arr: any[], size: number): any[][] => {
    const copy = [...arr]
    const result: any[][] = []
    for (let i = 0, max = arr.length / size; i < max || copy.length; i++) {
      result.push(copy.splice(0, size))
    }
    return result
  }

  deleteDocumentsByBatch = async (
    docs: FirebaseFirestore.DocumentReference[]
  ) => {
    const maxBatchSize = 500
    for (const devidedDocs of this.arrayChunk(docs, maxBatchSize)) {
      let batch = this.db.batch()
      devidedDocs.forEach((doc) => (batch = batch.delete(doc)))
      await batch.commit()
    }
  }

  deleteDocumentRecursive = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const docs = await this.getDocumentRecursive(req.body.paths)
    await this.deleteDocumentsByBatch(docs)
    res.end()
  }

  deleteCollectionRecursive = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const paths = req.body.paths

    let result: FirebaseFirestore.DocumentReference[] = []
    const docs = await this.db.collection(paths.join('/')).listDocuments()

    const allDocs = await Promise.all(
      docs.map((doc) => this.getDocumentRecursive([...paths, doc.id]))
    )
    result = result.concat(...allDocs)

    await this.deleteDocumentsByBatch(result)
    res.end()
  }

  getDocumentRecursive = async (
    paths: string[]
  ): Promise<FirebaseFirestore.DocumentReference[]> => {
    const doc = this.db.doc(paths.join('/'))
    let result: FirebaseFirestore.DocumentReference[] = [doc]

    const collections = await doc.listCollections()
    const allDocs = await Promise.all(
      collections.map((collection) =>
        this.db.collection([...paths, collection.id].join('/')).listDocuments()
      )
    )

    result = result.concat(...allDocs)

    for (const i in allDocs) {
      const collectionId = collections[i].id
      const docs = await Promise.all(
        allDocs[i].map((doc) =>
          this.getDocumentRecursive([...paths, collectionId, doc.id])
        )
      )
      result = result.concat(...docs)
    }

    return result
  }

  getType = (value: any): FieldType => {
    if (value === null) {
      return typeNull
    }
    if (typeof value === 'boolean') {
      return typeBoolean
    }
    if (typeof value === 'number' || typeof value === 'bigint') {
      return typeNumber
    }
    if (value instanceof FirebaseFirestore.Timestamp) {
      return typeDate
    }
    if (typeof value === 'string') {
      return typeString
    }
    if (value instanceof Uint8Array) {
      return typeByte
    }
    if (value instanceof FirebaseFirestore.DocumentReference) {
      return typeRef
    }
    if (value instanceof FirebaseFirestore.GeoPoint) {
      return typeGeo
    }
    if (Array.isArray(value)) {
      return typeArray
    }
    if (typeof value === 'object') {
      return typeMap
    }
    throw Error('unexpected type')
  }

  getField = (name: string, value: any): Field => {
    if (value === null) {
      return { name, type: typeNull.typeNumber, value: '' }
    }
    if (typeof value === 'boolean') {
      return { name, type: typeBoolean.typeNumber, value }
    }
    if (typeof value === 'number' || typeof value === 'bigint') {
      return { name, type: typeNumber.typeNumber, value }
    }
    if (value instanceof FirebaseFirestore.Timestamp) {
      return {
        name,
        type: typeDate.typeNumber,
        value: {
          seconds: value.seconds,
          nanoseconds: value.nanoseconds
        }
      }
    }
    if (typeof value === 'string') {
      return { name, type: typeString.typeNumber, value }
    }
    if (value instanceof Uint8Array) {
      // TODO
      return { name, type: typeByte.typeNumber, value }
    }
    if (value instanceof FirebaseFirestore.DocumentReference) {
      return { name, type: typeRef.typeNumber, value: value.path }
    }
    if (value instanceof FirebaseFirestore.GeoPoint) {
      return {
        name,
        type: typeGeo.typeNumber,
        value: {
          latitude: value.latitude,
          longitude: value.longitude
        }
      }
    }
    if (Array.isArray(value)) {
      return {
        name,
        type: typeArray.typeNumber,
        value: value.map((val, index) => this.getField(String(index), val))
      }
    }
    if (typeof value === 'object') {
      const valueMap: DocumentData = []
      for (const key in value) {
        valueMap.push(this.getField(key, value[key]))
      }
      return { name, type: typeMap.typeNumber, value: valueMap }
    }
    throw Error('unexpected type')
  }

  toField(value: any, type: number): any {
    if (type === typeNull.typeNumber) {
      return null
    }
    if (type === typeBoolean.typeNumber) {
      return value === true || value === 'true'
    }
    if (type === typeNumber.typeNumber) {
      return Number(value)
    }
    if (type === typeDate.typeNumber) {
      return new FirebaseFirestore.Timestamp(value.seconds, value.nanoseconds)
    }
    if (type === typeString.typeNumber) {
      return String(value)
    }
    if (type === typeRef.typeNumber) {
      return this.db.doc(value)
    }
    if (type === typeGeo.typeNumber) {
      return new FirebaseFirestore.GeoPoint(value.latitude, value.longitude)
    }
    if (type === typeArray.typeNumber) {
      const valueArray: any[] = []
      for (const key in value) {
        valueArray.push(this.toField(value[key].value, value[key].type))
      }
      return valueArray
    }
    if (type === typeMap.typeNumber) {
      const valueMap: { [key: string]: any } = {}
      for (const val of value) {
        valueMap[val.name] = this.toField(val.value, val.type)
      }
      return valueMap
    }
    throw Error('unexpected type')
  }
}

type FieldType = { typeNumber: number }

const typeNull: FieldType = { typeNumber: 0 }
const typeBoolean: FieldType = { typeNumber: 1 }
const typeNumber: FieldType = { typeNumber: 2 }
const typeDate: FieldType = { typeNumber: 3 }
const typeString: FieldType = { typeNumber: 4 }
const typeByte: FieldType = { typeNumber: 5 }
const typeRef: FieldType = { typeNumber: 6 }
const typeGeo: FieldType = { typeNumber: 7 }
const typeArray: FieldType = { typeNumber: 8 }
const typeMap: FieldType = { typeNumber: 9 }
