"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
class SchemaAbstraction {
    constructor() {
        this.schemas = {};
        this.models = new Map();
    }
    defineSchema(name, schemaDefinition) {
        if (this.models.has(name)) {
            throw new Error(`Model ${name} already exists`);
        }
        //creating Schema and model
        const schema = new mongoose_1.Schema(schemaDefinition);
        const model = mongoose_1.default.model(name, schema);
        this.models.set(name, model);
        return model;
    }
    createSubSchema(schemaDefinition) {
        return new mongoose_1.Schema(schemaDefinition, { _id: false });
    }
    getSchema(name) {
        const schema = this.schemas[name];
        if (!schema) {
            throw new Error(`Schema for ${name} not found`);
        }
        return schema;
    }
    getModel(name) {
        const model = this.models.get(name);
        if (!model) {
            throw new Error(`Model ${name} not found.`);
        }
        return model;
    }
}
exports.default = SchemaAbstraction;
