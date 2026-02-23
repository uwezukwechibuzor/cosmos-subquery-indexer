// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type TransactionProps = Omit<Transaction, NonNullable<FunctionPropertyNames<Transaction>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatTransactionProps = Omit<TransactionProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class Transaction implements CompatEntity {

    constructor(
        
        id: string,
        blockHeight: bigint,
        timestamp: Date,
        txHash: string,
        sender: string,
        success: boolean,
    ) {
        this.id = id;
        this.blockHeight = blockHeight;
        this.timestamp = timestamp;
        this.txHash = txHash;
        this.sender = sender;
        this.success = success;
        
    }

    public id: string;
    public blockHeight: bigint;
    public timestamp: Date;
    public txHash: string;
    public sender: string;
    public success: boolean;
    public gasWanted?: string;
    public gasUsed?: string;
    public fee?: string;
    public feeDenom?: string;
    public memo?: string;
    

    get _name(): string {
        return 'Transaction';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save Transaction entity without an ID");
        await store.set('Transaction', id.toString(), this as unknown as CompatTransactionProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove Transaction entity without an ID");
        await store.remove('Transaction', id.toString());
    }

    static async get(id: string): Promise<Transaction | undefined> {
        assert((id !== null && id !== undefined), "Cannot get Transaction entity without an ID");
        const record = await store.get('Transaction', id.toString());
        if (record) {
            return this.create(record as unknown as TransactionProps);
        } else {
            return;
        }
    }

    static async getByBlockHeight(blockHeight: bigint, options: GetOptions<CompatTransactionProps>): Promise<Transaction[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatTransactionProps>('Transaction', 'blockHeight', blockHeight, options);
        return records.map(record => this.create(record as unknown as TransactionProps));
    }
    

    static async getByTimestamp(timestamp: Date, options: GetOptions<CompatTransactionProps>): Promise<Transaction[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatTransactionProps>('Transaction', 'timestamp', timestamp, options);
        return records.map(record => this.create(record as unknown as TransactionProps));
    }
    

    static async getByTxHash(txHash: string, options: GetOptions<CompatTransactionProps>): Promise<Transaction[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatTransactionProps>('Transaction', 'txHash', txHash, options);
        return records.map(record => this.create(record as unknown as TransactionProps));
    }
    

    static async getBySender(sender: string, options: GetOptions<CompatTransactionProps>): Promise<Transaction[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatTransactionProps>('Transaction', 'sender', sender, options);
        return records.map(record => this.create(record as unknown as TransactionProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<TransactionProps>[], options: GetOptions<TransactionProps>): Promise<Transaction[]> {
        const records = await store.getByFields<CompatTransactionProps>('Transaction', filter  as unknown as FieldsExpression<CompatTransactionProps>[], options as unknown as GetOptions<CompatTransactionProps>);
        return records.map(record => this.create(record as unknown as TransactionProps));
    }

    static create(record: TransactionProps): Transaction {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.blockHeight,
            record.timestamp,
            record.txHash,
            record.sender,
            record.success,
        );
        Object.assign(entity,record);
        return entity;
    }
}
