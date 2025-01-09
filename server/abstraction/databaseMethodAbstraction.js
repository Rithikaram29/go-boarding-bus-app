"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class DataQueryAbstraction {
    constructor(model) {
        this.model = model;
    }
    find() {
        return __awaiter(this, arguments, void 0, function* (query = {}, projection = {}, useLean = false) {
            try {
                let queryBuilder = this.model.find(query, projection);
                if (useLean) {
                    queryBuilder = queryBuilder.lean();
                }
                return yield queryBuilder;
            }
            catch (error) {
                throw new Error(`Error while finding documents: ${error.message}`);
            }
        });
    }
    findOne() {
        return __awaiter(this, arguments, void 0, function* (query = {}, projection = {}, useLean = false) {
            try {
                let queryBuilder = this.model.findOne(query, projection);
                if (useLean) {
                    queryBuilder = queryBuilder.lean();
                }
                return yield queryBuilder;
            }
            catch (error) {
                throw new Error(`Error while finding a document: ${error.message}`);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findById(id);
            }
            catch (error) {
                throw new Error(`Error finding document ${error.message}`);
            }
        });
    }
    update(query_1, update_1) {
        return __awaiter(this, arguments, void 0, function* (query, update, arg = {}) {
            try {
                yield this.model.updateOne(query, update, arg);
            }
            catch (error) {
                throw new Error(`Error updating document ${error.message}`);
            }
        });
    }
    findOneAndUpdate(query, projection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOneAndUpdate(query, projection);
            }
            catch (error) {
                throw new Error(`Error while updating documents: ${error.message}`);
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.create(data);
            }
            catch (error) {
                throw new Error(`Error while creatin document: ${error.message}`);
            }
        });
    }
    save(document) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield document.save();
            }
            catch (error) {
                throw new Error(`Error saving the document ${error.message}`);
            }
        });
    }
    populate(query, populateObj) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find(query).populate(populateObj).exec();
            }
            catch (error) {
                throw new Error(`Error populating the document: ${error.message}`);
            }
        });
    }
    delete(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.deleteOne(query);
            }
            catch (error) {
                throw new Error(`Error deleting document: ${error.meaage}`);
            }
        });
    }
}
exports.default = DataQueryAbstraction;
