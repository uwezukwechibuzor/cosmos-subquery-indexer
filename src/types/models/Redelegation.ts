// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type RedelegationProps = Omit<Redelegation, NonNullable<FunctionPropertyNames<Redelegation>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatRedelegationProps = Omit<RedelegationProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class Redelegation implements CompatEntity {

    constructor(
        
        id: string,
        delegator: string,
        validatorSrc: string,
        validatorDst: string,
        amount: string,
        denom: string,
        completionTime: Date,
        blockHeight: bigint,
        timestamp: Date,
        txHash: string,
    ) {
        this.id = id;
        this.delegator = delegator;
        this.validatorSrc = validatorSrc;
        this.validatorDst = validatorDst;
        this.amount = amount;
        this.denom = denom;
        this.completionTime = completionTime;
        this.blockHeight = blockHeight;
        this.timestamp = timestamp;
        this.txHash = txHash;
        
    }

    public id: string;
    public delegator: string;
    public validatorSrc: string;
    public validatorDst: string;
    public amount: string;
    public denom: string;
    public completionTime: Date;
    public blockHeight: bigint;
    public timestamp: Date;
    public txHash: string;
    

    get _name(): string {
        return 'Redelegation';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save Redelegation entity without an ID");
        await store.set('Redelegation', id.toString(), this as unknown as CompatRedelegationProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove Redelegation entity without an ID");
        await store.remove('Redelegation', id.toString());
    }

    static async get(id: string): Promise<Redelegation | undefined> {
        assert((id !== null && id !== undefined), "Cannot get Redelegation entity without an ID");
        const record = await store.get('Redelegation', id.toString());
        if (record) {
            return this.create(record as unknown as RedelegationProps);
        } else {
            return;
        }
    }

    static async getByDelegator(delegator: string, options: GetOptions<CompatRedelegationProps>): Promise<Redelegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatRedelegationProps>('Redelegation', 'delegator', delegator, options);
        return records.map(record => this.create(record as unknown as RedelegationProps));
    }
    

    static async getByValidatorSrc(validatorSrc: string, options: GetOptions<CompatRedelegationProps>): Promise<Redelegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatRedelegationProps>('Redelegation', 'validatorSrc', validatorSrc, options);
        return records.map(record => this.create(record as unknown as RedelegationProps));
    }
    

    static async getByValidatorDst(validatorDst: string, options: GetOptions<CompatRedelegationProps>): Promise<Redelegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatRedelegationProps>('Redelegation', 'validatorDst', validatorDst, options);
        return records.map(record => this.create(record as unknown as RedelegationProps));
    }
    

    static async getByBlockHeight(blockHeight: bigint, options: GetOptions<CompatRedelegationProps>): Promise<Redelegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatRedelegationProps>('Redelegation', 'blockHeight', blockHeight, options);
        return records.map(record => this.create(record as unknown as RedelegationProps));
    }
    

    static async getByTxHash(txHash: string, options: GetOptions<CompatRedelegationProps>): Promise<Redelegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatRedelegationProps>('Redelegation', 'txHash', txHash, options);
        return records.map(record => this.create(record as unknown as RedelegationProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<RedelegationProps>[], options: GetOptions<RedelegationProps>): Promise<Redelegation[]> {
        const records = await store.getByFields<CompatRedelegationProps>('Redelegation', filter  as unknown as FieldsExpression<CompatRedelegationProps>[], options as unknown as GetOptions<CompatRedelegationProps>);
        return records.map(record => this.create(record as unknown as RedelegationProps));
    }

    static create(record: RedelegationProps): Redelegation {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.delegator,
            record.validatorSrc,
            record.validatorDst,
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
