import { DeleteResult, EntityTarget } from "typeorm";
import { dbCreateConnection } from "../orm/dbCreateConnection";
import * as mongodb from "mongodb";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

const saveEntity = async (entity: EntityTarget<unknown>, entityData: QueryDeepPartialEntity<unknown>) => {

    const save = dbCreateConnection
        .getMongoRepository(entity)
        .create(entityData);

    const results = await dbCreateConnection
        .getMongoRepository(entity)
        .save(save);

    return results;
};

const getEntity = async (entity: EntityTarget<unknown>, id: mongodb.ObjectId) => {

    const singleEntity = await dbCreateConnection.getMongoRepository(entity).findBy(id);
    return singleEntity;
};

const updateEntity = async (entity: EntityTarget<unknown>, id: mongodb.ObjectId, entityData: QueryDeepPartialEntity<unknown>) => {

    const UpdatedEntity = await dbCreateConnection
        .getMongoRepository(entity)
        .update(id, entityData);
    return UpdatedEntity;

};

const deleteEntity = async (entity: EntityTarget<any>, id: mongodb.ObjectId): Promise<DeleteResult> => {

    const deletedEntity = await dbCreateConnection
        .getMongoRepository(entity)
        .delete(id);

    return deletedEntity;

};

const getAllEntity = async (entity: EntityTarget<any>, from: string, localField: string, foreignField: string, as: string) => {

    const allEntity = await dbCreateConnection.getMongoRepository(entity).find();
    let allEty: Array<typeof entity> = [];

    for (const entityFor of allEntity) {
        const entityUser = await dbCreateConnection.getMongoRepository(entity).aggregate([
            {
                $match: {
                    _id: { $eq: entityFor.id },
                }
            },
            {
                $lookup: {
                    from: from,
                    localField: localField,
                    foreignField: foreignField,
                    as: as
                }
            }])
            .next();

        allEty.push(entityUser);
    }
    return allEty;
};

const getEntityWithAggregation = async (entity: EntityTarget<unknown>, id: mongodb.ObjectId, from: string, localField: string, foreignField: string, as: string) => {

    const singleEntity = await dbCreateConnection
        .getMongoRepository(entity)
        .aggregate([
            {
                $match: {
                    _id: { $eq: id },
                },
            },
            {
                $lookup: {
                    from: from,
                    localField: localField,
                    foreignField: foreignField,
                    as: as,
                },
            },
        ])
        .next();
        
    return singleEntity;
};

export default { saveEntity, getEntity, updateEntity, deleteEntity, getAllEntity, getEntityWithAggregation }