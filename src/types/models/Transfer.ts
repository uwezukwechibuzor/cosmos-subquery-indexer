// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type TransferProps = Omit<Transfer, NonNullable<FunctionPropertyNames<Transfer>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatTransferProps = Omit<TransferProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class Transfer implements CompatEntity {

    constructor(
        
        id: string,
        blockHeight: bigint,
        timestamp: Date,
        txHash: string,
        fromId: string,
        toId: string,
        amount: string,
        denom: string,
        success: boolean,
    ) {
        this.id = id;
        this.blockHeight = blockHeight;
        this.timestamp = timestamp;
        this.txHash = txHash;
        this.fromId = fromId;
        this.toId = toId;
        this.amount = amount;
        this.denom = denom;
        this.success = success;
        
    }

    public id: string;
    public blockHeight: bigint;
    public timestamp: Date;
    public txHash: string;
    public fromId: string;
    public toId: string;
    public amount: string;
    public denom: string;
    public success: boolean;
    

    get _name(): string {
        return 'Transfer';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save Transfer entity without an ID");
        await store.set('Transfer', id.toString(), this as unknown as CompatTransferProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove Transfer entity without an ID");
        await store.remove('Transfer', id.toString());
    }

    static async get(id: string): Promise<Transfer | undefined> {
        assert((id !== null && id !== undefined), "Cannot get Transfer entity without an ID");
        const record = await store.get('Transfer', id.toString());
        if (record) {
            return this.create(record as unknown as TransferProps);
        } else {
            return;
        }
    }

    static async getByBlockHeight(blockHeight: bigint, options: GetOptions<CompatTransferProps>): Promise<Transfer[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatTransferProps>('Transfer', 'blockHeight', blockHeight, options);
        return records.map(record => this.create(record as unknown as TransferProps));
    }
    

    static async getByTxHash(txHash: string, options: GetOptions<CompatTransferProps>): Promise<Transfer[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatTransferProps>('Transfer', 'txHash', txHash, options);
        return records.map(record => this.create(record as unknown as TransferProps));
    }
    

    static async getByFromId(fromId: string, options: GetOptions<CompatTransferProps>): Promise<Transfer[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatTransferProps>('Transfer', 'fromId', fromId, options);
        return records.map(record => this.create(record as unknown as TransferProps));
    }
    

    static async getByToId(toId: string, options: GetOptions<CompatTransferProps>): Promise<Transfer[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatTransferProps>('Transfer', 'toId', toId, options);
        return records.map(record => this.create(record as unknown as TransferProps));
    }
    

    static async getByDenom(denom: string, options: GetOptions<CompatTransferProps>): Promise<Transfer[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatTransferProps>('Transfer', 'denom', denom, options);
        return records.map(record => this.create(record as unknown as TransferProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<TransferProps>[], options: GetOptions<TransferProps>): Promise<Transfer[]> {
        const records = await store.getByFields<CompatTransferProps>('Transfer', filter  as unknown as FieldsExpression<CompatTransferProps>[], options as unknown as GetOptions<CompatTransferProps>);
        return records.map(record => this.create(record as unknown as TransferProps));
    }

    static create(record: TransferProps): Transfer {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.blockHeight,
            record.timestamp,
            record.txHash,
            record.fromId,
            record.toId,
            record.amount,
            record.denom,
            record.success,
        );
        Object.assign(entity,record);
        return entity;
    }
}
