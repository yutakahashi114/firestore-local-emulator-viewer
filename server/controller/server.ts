import * as admin from 'firebase-admin'
import express from 'express'
import bodyParser from 'body-parser'
import { FirestoreController } from './firestore'
import { asyncMiddleware, errorHandler } from './middleware/error'

export function serve() {
  if (admin.apps.length === 0) {
    admin.initializeApp({ projectId: process.env.PROJECT_ID })
  }
  const db = admin.firestore()

  const firestoreController = new FirestoreController(db)

  const app = express()
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  app.use(bodyParser.json())
  app.use(errorHandler)

  app.get('/collection', asyncMiddleware(firestoreController.getCollections))
  app.get('/documents', asyncMiddleware(firestoreController.getDocuments))
  app.get('/document', asyncMiddleware(firestoreController.getDocument))
  app.post('/document', asyncMiddleware(firestoreController.updateDocument))
  app.put('/document', asyncMiddleware(firestoreController.addDocument))
  app.delete('/field', asyncMiddleware(firestoreController.deleteDocumentField))
  app.delete(
    '/field/all',
    asyncMiddleware(firestoreController.deleteDocumentAllField)
  )
  app.delete(
    '/collection',
    asyncMiddleware(firestoreController.deleteCollectionRecursive)
  )
  app.delete(
    '/document',
    asyncMiddleware(firestoreController.deleteDocumentRecursive)
  )

  return app
}
