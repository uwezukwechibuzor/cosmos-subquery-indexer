// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type DelegationProps = Omit<Delegation, NonNullable<FunctionPropertyNames<Delegation>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatDelegationProps = Omit<DelegationProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class Delegation implements CompatEntity {

    constructor(
        
        id: string,
        delegatorId: string,
        validatorId: string,
        shares: string,
        blockHeight: bigint,
        timestamp: Date,
    ) {
        this.id = id;
        this.delegatorId = delegatorId;
        this.validatorId = validatorId;
        this.shares = shares;
        this.blockHeight = blockHeight;
        this.timestamp = timestamp;
        
    }

    public id: string;
    public delegatorId: string;
    public validatorId: string;
    public shares: string;
    public amount?: string;
    public blockHeight: bigint;
    public timestamp: Date;
    

    get _name(): string {
        return 'Delegation';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save Delegation entity without an ID");
        await store.set('Delegation', id.toString(), this as unknown as CompatDelegationProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove Delegation entity without an ID");
        await store.remove('Delegation', id.toString());
    }

    static async get(id: string): Promise<Delegation | undefined> {
        assert((id !== null && id !== undefined), "Cannot get Delegation entity without an ID");
        const record = await store.get('Delegation', id.toString());
        if (record) {
            return this.create(record as unknown as DelegationProps);
        } else {
            return;
        }
    }

    static async getByDelegatorId(delegatorId: string, options: GetOptions<CompatDelegationProps>): Promise<Delegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatDelegationProps>('Delegation', 'delegatorId', delegatorId, options);
        return records.map(record => this.create(record as unknown as DelegationProps));
    }
    

    static async getByValidatorId(validatorId: string, options: GetOptions<CompatDelegationProps>): Promise<Delegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatDelegationProps>('Delegation', 'validatorId', validatorId, options);
        return records.map(record => this.create(record as unknown as DelegationProps));
    }
    

    static async getByBlockHeight(blockHeight: bigint, options: GetOptions<CompatDelegationProps>): Promise<Delegation[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatDelegationProps>('Delegation', 'blockHeight', blockHeight, options);
        return records.map(record => this.create(record as unknown as DelegationProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<DelegationProps>[], options: GetOptions<DelegationProps>): Promise<Delegation[]> {
        const records = await store.getByFields<CompatDelegationProps>('Delegation', filter  as unknown as FieldsExpression<CompatDelegationProps>[], options as unknown as GetOptions<CompatDelegationProps>);
        return records.map(record => this.create(record as unknown as DelegationProps));
    }

    static create(record: DelegationProps): Delegation {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.delegatorId,
            record.validatorId,
            record.shares,
            record.blockHeight,
            record.timestamp,
        );
        Object.assign(entity,record);
        return entity;
    }
}
