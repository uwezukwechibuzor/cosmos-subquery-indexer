// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type CommissionProps = Omit<Commission, NonNullable<FunctionPropertyNames<Commission>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatCommissionProps = Omit<CommissionProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class Commission implements CompatEntity {

    constructor(
        
        id: string,
        validator: string,
        amount: string,
        denom: string,
        blockHeight: bigint,
        timestamp: Date,
        txHash: string,
    ) {
        this.id = id;
        this.validator = validator;
        this.amount = amount;
        this.denom = denom;
        this.blockHeight = blockHeight;
        this.timestamp = timestamp;
        this.txHash = txHash;
        
    }

    public id: string;
    public validator: string;
    public amount: string;
    public denom: string;
    public blockHeight: bigint;
    public timestamp: Date;
    public txHash: string;
    

    get _name(): string {
        return 'Commission';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save Commission entity without an ID");
        await store.set('Commission', id.toString(), this as unknown as CompatCommissionProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove Commission entity without an ID");
        await store.remove('Commission', id.toString());
    }

    static async get(id: string): Promise<Commission | undefined> {
        assert((id !== null && id !== undefined), "Cannot get Commission entity without an ID");
        const record = await store.get('Commission', id.toString());
        if (record) {
            return this.create(record as unknown as CommissionProps);
        } else {
            return;
        }
    }

    static async getByValidator(validator: string, options: GetOptions<CompatCommissionProps>): Promise<Commission[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatCommissionProps>('Commission', 'validator', validator, options);
        return records.map(record => this.create(record as unknown as CommissionProps));
    }
    

    static async getByBlockHeight(blockHeight: bigint, options: GetOptions<CompatCommissionProps>): Promise<Commission[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatCommissionProps>('Commission', 'blockHeight', blockHeight, options);
        return records.map(record => this.create(record as unknown as CommissionProps));
    }
    

    static async getByTxHash(txHash: string, options: GetOptions<CompatCommissionProps>): Promise<Commission[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatCommissionProps>('Commission', 'txHash', txHash, options);
        return records.map(record => this.create(record as unknown as CommissionProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<CommissionProps>[], options: GetOptions<CommissionProps>): Promise<Commission[]> {
        const records = await store.getByFields<CompatCommissionProps>('Commission', filter  as unknown as FieldsExpression<CompatCommissionProps>[], options as unknown as GetOptions<CompatCommissionProps>);
        return records.map(record => this.create(record as unknown as CommissionProps));
    }

    static create(record: CommissionProps): Commission {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.validator,
            record.amount,
            record.denom,
            record.blockHeight,
            record.timestamp,
            record.txHash,
        );
        Object.assign(entity,record);
        return entity;
    }
}
