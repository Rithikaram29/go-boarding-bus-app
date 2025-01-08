import { Model, Document, Types } from "mongoose";

interface PopulateOptions {
  path: string; 
  select?: string; 
  model?: string; 
}

class DataQueryAbstraction<T extends Document> {
  constructor(private model: Model<T>) {}

  async find(query: object = {}, projection: object = {}, useLean: boolean = false) {
    try {
      let queryBuilder: any = this.model.find(query, projection);
      if (useLean) {
        queryBuilder = queryBuilder.lean()
      }
      return await queryBuilder;
    } catch (error: any) {
      throw new Error(`Error while finding documents: ${error.message}`);
    }
  }

  async findOne(query: object = {}, projection: object = {}, useLean: boolean = false) {
    try {
      let queryBuilder: any = this.model.findOne(query, projection);
      if (useLean) {
        queryBuilder = queryBuilder.lean();
      }
      return await queryBuilder;
    } catch (error: any) {
      throw new Error(`Error while finding a document: ${error.message}`);
    }
  }
  
  
  async findById(id: Types.ObjectId | string) {
    try {
      return await this.model.findById(id);
    } catch (error: any) {
      throw new Error(`Error finding document ${error.message}`);
    }
  }

  async update(query: object, update: object, arg: object = {}) {
    try {
      await this.model.updateOne(query, update, arg);
    } catch (error: any) {
      throw new Error(`Error updating document ${error.message}`);
    }
  }

  async findOneAndUpdate(query: object, projection: object) {
    try {
      return await this.model.findOneAndUpdate(query, projection);
    } catch (error: any) {
      throw new Error(`Error while updating documents: ${error.message}`);
    }
  }

  async create(data: T) {
    try {
      return await this.model.create(data);
    } catch (error: any) {
      throw new Error(`Error while creatin document: ${error.message}`);
    }
  }

  async save(document: T) {
    try {
      return await document.save();
    } catch (error: any) {
      throw new Error(`Error saving the document ${error.message}`);
    }
  }
  async populate(query: object, populateObj: PopulateOptions | PopulateOptions[]) {
    try {
      return await this.model.find(query).populate(populateObj).exec();
    } catch (error: any) {
      throw new Error(`Error populating the document: ${error.message}`);
    }
  }


  async delete(query: object) {
    try {
      return await this.model.deleteOne(query);
    } catch (error: any) {
      throw new Error(`Error deleting document: ${error.meaage}`);
    }
  }
}

export default DataQueryAbstraction;
