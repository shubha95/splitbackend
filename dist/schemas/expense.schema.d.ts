import { Document, Schema as MongooseSchema } from 'mongoose';
export type ExpenseDocument = Expense & Document & {
    createdAt: Date;
    updatedAt: Date;
};
export declare class Expense {
    userId: MongooseSchema.Types.ObjectId;
    price: number;
    description: string;
    groupID: string;
}
export declare const ExpenseSchema: MongooseSchema<Expense, import("mongoose").Model<Expense, any, any, any, Document<unknown, any, Expense, any, {}> & Expense & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Expense, Document<unknown, {}, import("mongoose").FlatRecord<Expense>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Expense> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
