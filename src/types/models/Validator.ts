// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';


import {
    ValidatorStatus,
} from '../enums';

export type ValidatorProps = Omit<Validator, NonNullable<FunctionPropertyNames<Validator>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatValidatorProps = Omit<ValidatorProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class Validator implements CompatEntity {

    constructor(
        
        id: string,
        address: string,
        status: ValidatorStatus,
        jailed: boolean,
        firstSeenBlock: bigint,
        firstSeenTime: Date,
    ) {
        this.id = id;
        this.address = address;
        this.status = status;
        this.jailed = jailed;
        this.firstSeenBlock = firstSeenBlock;
        this.firstSeenTime = firstSeenTime;
        
    }

    public id: string;
    public address: string;
    public moniker?: string;
    public website?: string;
    public details?: string;
    public commissionRate?: string;
    public maxCommissionRate?: string;
    public maxCommissionChangeRate?: string;
    public minSelfDelegation?: string;
    public status: ValidatorStatus;
    public jailed: boolean;
    public tokens?: string;
    public delegatorShares?: string;
    public firstSeenBlock: bigint;
    public firstSeenTime: Date;
    

    get _name(): string {
        return 'Validator';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save Validator entity without an ID");
        await store.set('Validator', id.toString(), this as unknown as CompatValidatorProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove Validator entity without an ID");
        await store.remove('Validator', id.toString());
    }

    static async get(id: string): Promise<Validator | undefined> {
        assert((id !== null && id !== undefined), "Cannot get Validator entity without an ID");
        const record = await store.get('Validator', id.toString());
        if (record) {
            return this.create(record as unknown as ValidatorProps);
        } else {
            return;
        }
    }

    static async getByAddress(address: string, options: GetOptions<CompatValidatorProps>): Promise<Validator[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatValidatorProps>('Validator', 'address', address, options);
        return records.map(record => this.create(record as unknown as ValidatorProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<ValidatorProps>[], options: GetOptions<ValidatorProps>): Promise<Validator[]> {
        const records = await store.getByFields<CompatValidatorProps>('Validator', filter  as unknown as FieldsExpression<CompatValidatorProps>[], options as unknown as GetOptions<CompatValidatorProps>);
        return records.map(record => this.create(record as unknown as ValidatorProps));
    }

    static create(record: ValidatorProps): Validator {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.address,
            record.status,
            record.jailed,
            record.firstSeenBlock,
            record.firstSeenTime,
        );
        Object.assign(entity,record);
        return entity;
    }
}
