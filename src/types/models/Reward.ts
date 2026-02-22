// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type RewardProps = Omit<Reward, NonNullable<FunctionPropertyNames<Reward>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatRewardProps = Omit<RewardProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class Reward implements CompatEntity {

    constructor(
        
        id: string,
        delegator: string,
        validator: string,
        amount: string,
        denom: string,
        blockHeight: bigint,
        timestamp: Date,
        txHash: string,
    ) {
        this.id = id;
        this.delegator = delegator;
        this.validator = validator;
        this.amount = amount;
        this.denom = denom;
        this.blockHeight = blockHeight;
        this.timestamp = timestamp;
        this.txHash = txHash;
        
    }

    public id: string;
    public delegator: string;
    public validator: string;
    public amount: string;
    public denom: string;
    public blockHeight: bigint;
    public timestamp: Date;
    public txHash: string;
    

    get _name(): string {
        return 'Reward';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save Reward entity without an ID");
        await store.set('Reward', id.toString(), this as unknown as CompatRewardProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove Reward entity without an ID");
        await store.remove('Reward', id.toString());
    }

    static async get(id: string): Promise<Reward | undefined> {
        assert((id !== null && id !== undefined), "Cannot get Reward entity without an ID");
        const record = await store.get('Reward', id.toString());
        if (record) {
            return this.create(record as unknown as RewardProps);
        } else {
            return;
        }
    }

    static async getByDelegator(delegator: string, options: GetOptions<CompatRewardProps>): Promise<Reward[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatRewardProps>('Reward', 'delegator', delegator, options);
        return records.map(record => this.create(record as unknown as RewardProps));
    }
    

    static async getByValidator(validator: string, options: GetOptions<CompatRewardProps>): Promise<Reward[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatRewardProps>('Reward', 'validator', validator, options);
        return records.map(record => this.create(record as unknown as RewardProps));
    }
    

    static async getByBlockHeight(blockHeight: bigint, options: GetOptions<CompatRewardProps>): Promise<Reward[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatRewardProps>('Reward', 'blockHeight', blockHeight, options);
        return records.map(record => this.create(record as unknown as RewardProps));
    }
    

    static async getByTxHash(txHash: string, options: GetOptions<CompatRewardProps>): Promise<Reward[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatRewardProps>('Reward', 'txHash', txHash, options);
        return records.map(record => this.create(record as unknown as RewardProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<RewardProps>[], options: GetOptions<RewardProps>): Promise<Reward[]> {
        const records = await store.getByFields<CompatRewardProps>('Reward', filter  as unknown as FieldsExpression<CompatRewardProps>[], options as unknown as GetOptions<CompatRewardProps>);
        return records.map(record => this.create(record as unknown as RewardProps));
    }

    static create(record: RewardProps): Reward {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.delegator,
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
