import MAPPED_DELETE from './MAPPED_DELETE'
import MAPPED_GET from './MAPPED_GET'
import MAPPED_GET_LIST from './MAPPED_GET_LIST'
import MAPPED_INSERT from './MAPPED_INSERT'
import MAPPED_TRUNCATE from './MAPPED_TRUNCATE'
import MAPPED_UPDATE from './MAPPED_UPDATE'

const mappedGet = new MAPPED_GET()
const mappedGetLIST = new MAPPED_GET_LIST()
const mappedInsert = new MAPPED_INSERT()
const mappedUpdate = new MAPPED_UPDATE()
const mappedDelete = new MAPPED_DELETE()
const mappedTruncate = new MAPPED_TRUNCATE()

export type SERVER_GET_TYPE = keyof (typeof mappedGet.mapped_data)
export type SERVER_GET_LIST_TYPE = keyof (typeof mappedGetLIST.mapped_data)
export type SERVER_INSERT_TYPE = keyof (typeof mappedInsert.mapped_data)
export type SERVER_UPDATE_TYPE = keyof (typeof mappedUpdate.mapped_data)
export type SERVER_DELETE_TYPE = keyof (typeof mappedDelete.mapped_data)
export type SERVER_TRUNCATE_TYPE = keyof (typeof mappedTruncate.mapped_data)