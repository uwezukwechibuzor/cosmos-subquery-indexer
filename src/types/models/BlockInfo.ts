// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type BlockInfoProps = Omit<BlockInfo, NonNullable<FunctionPropertyNames<BlockInfo>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatBlockInfoProps = Omit<BlockInfoProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class BlockInfo implements CompatEntity {

    constructor(
        
        id: string,
        height: bigint,
        hash: string,
        timestamp: Date,
        transactionCount: number,
        proposer: string,
    ) {
        this.id = id;
        this.height = height;
        this.hash = hash;
        this.timestamp = timestamp;
        this.transactionCount = transactionCount;
        this.proposer = proposer;
        
    }

    public id: string;
    public height: bigint;
    public hash: string;
    public timestamp: Date;
    public transactionCount: number;
    public proposer: string;
    

    get _name(): string {
        return 'BlockInfo';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save BlockInfo entity without an ID");
        await store.set('BlockInfo', id.toString(), this as unknown as CompatBlockInfoProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove BlockInfo entity without an ID");
        await store.remove('BlockInfo', id.toString());
    }

    static async get(id: string): Promise<BlockInfo | undefined> {
        assert((id !== null && id !== undefined), "Cannot get BlockInfo entity without an ID");
        const record = await store.get('BlockInfo', id.toString());
        if (record) {
            return this.create(record as unknown as BlockInfoProps);
        } else {
            return;
        }
    }

    static async getByHeight(height: bigint, options: GetOptions<CompatBlockInfoProps>): Promise<BlockInfo[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatBlockInfoProps>('BlockInfo', 'height', height, options);
        return records.map(record => this.create(record as unknown as BlockInfoProps));
    }
    

    static async getByTimestamp(timestamp: Date, options: GetOptions<CompatBlockInfoProps>): Promise<BlockInfo[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatBlockInfoProps>('BlockInfo', 'timestamp', timestamp, options);
        return records.map(record => this.create(record as unknown as BlockInfoProps));
    }
    

    static async getByProposer(proposer: string, options: GetOptions<CompatBlockInfoProps>): Promise<BlockInfo[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatBlockInfoProps>('BlockInfo', 'proposer', proposer, options);
        return records.map(record => this.create(record as unknown as BlockInfoProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<BlockInfoProps>[], options: GetOptions<BlockInfoProps>): Promise<BlockInfo[]> {
        const records = await store.getByFields<CompatBlockInfoProps>('BlockInfo', filter  as unknown as FieldsExpression<CompatBlockInfoProps>[], options as unknown as GetOptions<CompatBlockInfoProps>);
        return records.map(record => this.create(record as unknown as BlockInfoProps));
    }

    static create(record: BlockInfoProps): BlockInfo {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.height,
            record.hash,
            record.timestamp,
            record.transactionCount,
            record.proposer,
        );
        Object.assign(entity,record);
        return entity;
    }
}
