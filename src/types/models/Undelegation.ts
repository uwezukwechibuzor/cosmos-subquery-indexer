// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type UndelegationProps = Omit<Undelegation, NonNullable<FunctionPropertyNames<Undelegation>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatUndelegationProps = Omit<UndelegationProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class Undelegation implements CompatEntity {

    constructor(
        
        id: string,
        delegator: string,
        validator: string,
        amount: string,
        denom: string,
        completionTime: Date,
        blockHeight: bigint,
        timestamp: Date,
        txHash: string,
    ) {
        this.id = id;
        this.delegator = delegator;
        this.validator = validator;
        this.amount = amount;
        this.denom = denom;
        this.completionTime = completionTime;
        this.blockHeight = blockHeight;
        this.timestamp = timestamp;
        this.txHash = txHash;
        
    }

    public id: string;
    public delegator: string;
    public validator: string;
    public amount: string;
    public denom: string;
    public completionTime: Date;
    public blockHeight: bigint;
    public timestamp: Date;
    public txHash: string;
    

    get _name(): string {
        return 'Undelegation';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save Undelegation entity without an ID");
        await store.set('Undelegation', id.toString(), this as unknown as CompatUndelegationProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove Undelegation entity without an ID");
        await store.remove('Undelegation', id.toString());
    }

    static async get(id: string): Promise<Undelegation | undefined> {
        assert((id !== null && id !== undefined), "Cannot get Undelegation entity without an ID");
        const record = await store.get('Undelegation', id.toString());
        if (record) {
            return this.create(record as unknown as UndelegationProps);
        } else {
            return;
        }
    }

    static async getByDelegator(delegator: string, options: GetOptions<CompatUndelegationProps>): Promise<Undelegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatUndelegationProps>('Undelegation', 'delegator', delegator, options);
        return records.map(record => this.create(record as unknown as UndelegationProps));
    }
    

    static async getByValidator(validator: string, options: GetOptions<CompatUndelegationProps>): Promise<Undelegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatUndelegationProps>('Undelegation', 'validator', validator, options);
        return records.map(record => this.create(record as unknown as UndelegationProps));
    }
    

    static async getByBlockHeight(blockHeight: bigint, options: GetOptions<CompatUndelegationProps>): Promise<Undelegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatUndelegationProps>('Undelegation', 'blockHeight', blockHeight, options);
        return records.map(record => this.create(record as unknown as UndelegationProps));
    }
    

    static async getByTxHash(txHash: string, options: GetOptions<CompatUndelegationProps>): Promise<Undelegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatUndelegationProps>('Undelegation', 'txHash', txHash, options);
        return records.map(record => this.create(record as unknown as UndelegationProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<UndelegationProps>[], options: GetOptions<UndelegationProps>): Promise<Undelegation[]> {
        const records = await store.getByFields<CompatUndelegationProps>('Undelegation', filter  as unknown as FieldsExpression<CompatUndelegationProps>[], options as unknown as GetOptions<CompatUndelegationProps>);
        return records.map(record => this.create(record as unknown as UndelegationProps));
    }

    static create(record: UndelegationProps): Undelegation {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.delegator,
            record.validator,
            record.amount,
            record.denom,
            record.completionTime,
            record.blockHeight,
            record.timestamp,
            record.txHash,
        );
        Object.assign(entity,record);
        return entity;
    }
}
