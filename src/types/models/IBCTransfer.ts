// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type IBCTransferProps = Omit<IBCTransfer, NonNullable<FunctionPropertyNames<IBCTransfer>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatIBCTransferProps = Omit<IBCTransferProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class IBCTransfer implements CompatEntity {

    constructor(
        
        id: string,
        blockHeight: bigint,
        timestamp: Date,
        txHash: string,
        sender: string,
        receiver: string,
        amount: string,
        denom: string,
        sourcePort: string,
        sourceChannel: string,
        success: boolean,
    ) {
        this.id = id;
        this.blockHeight = blockHeight;
        this.timestamp = timestamp;
        this.txHash = txHash;
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.denom = denom;
        this.sourcePort = sourcePort;
        this.sourceChannel = sourceChannel;
        this.success = success;
        
    }

    public id: string;
    public blockHeight: bigint;
    public timestamp: Date;
    public txHash: string;
    public sender: string;
    public receiver: string;
    public amount: string;
    public denom: string;
    public sourcePort: string;
    public sourceChannel: string;
    public destinationPort?: string;
    public destinationChannel?: string;
    public timeoutHeight?: string;
    public timeoutTimestamp?: string;
    public memo?: string;
    public success: boolean;
    

    get _name(): string {
        return 'IBCTransfer';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save IBCTransfer entity without an ID");
        await store.set('IBCTransfer', id.toString(), this as unknown as CompatIBCTransferProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove IBCTransfer entity without an ID");
        await store.remove('IBCTransfer', id.toString());
    }

    static async get(id: string): Promise<IBCTransfer | undefined> {
        assert((id !== null && id !== undefined), "Cannot get IBCTransfer entity without an ID");
        const record = await store.get('IBCTransfer', id.toString());
        if (record) {
            return this.create(record as unknown as IBCTransferProps);
        } else {
            return;
        }
    }

    static async getByBlockHeight(blockHeight: bigint, options: GetOptions<CompatIBCTransferProps>): Promise<IBCTransfer[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatIBCTransferProps>('IBCTransfer', 'blockHeight', blockHeight, options);
        return records.map(record => this.create(record as unknown as IBCTransferProps));
    }
    

    static async getByTxHash(txHash: string, options: GetOptions<CompatIBCTransferProps>): Promise<IBCTransfer[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatIBCTransferProps>('IBCTransfer', 'txHash', txHash, options);
        return records.map(record => this.create(record as unknown as IBCTransferProps));
    }
    

    static async getBySender(sender: string, options: GetOptions<CompatIBCTransferProps>): Promise<IBCTransfer[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatIBCTransferProps>('IBCTransfer', 'sender', sender, options);
        return records.map(record => this.create(record as unknown as IBCTransferProps));
    }
    

    static async getByReceiver(receiver: string, options: GetOptions<CompatIBCTransferProps>): Promise<IBCTransfer[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatIBCTransferProps>('IBCTransfer', 'receiver', receiver, options);
        return records.map(record => this.create(record as unknown as IBCTransferProps));
    }
    

    static async getBySourceChannel(sourceChannel: string, options: GetOptions<CompatIBCTransferProps>): Promise<IBCTransfer[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatIBCTransferProps>('IBCTransfer', 'sourceChannel', sourceChannel, options);
        return records.map(record => this.create(record as unknown as IBCTransferProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<IBCTransferProps>[], options: GetOptions<IBCTransferProps>): Promise<IBCTransfer[]> {
        const records = await store.getByFields<CompatIBCTransferProps>('IBCTransfer', filter  as unknown as FieldsExpression<CompatIBCTransferProps>[], options as unknown as GetOptions<CompatIBCTransferProps>);
        return records.map(record => this.create(record as unknown as IBCTransferProps));
    }

    static create(record: IBCTransferProps): IBCTransfer {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.blockHeight,
            record.timestamp,
            record.txHash,
            record.sender,
            record.receiver,
            record.amount,
            record.denom,
            record.sourcePort,
            record.sourceChannel,
            record.success,
        );
        Object.assign(entity,record);
        return entity;
    }
}
