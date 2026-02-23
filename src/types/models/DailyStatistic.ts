// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames, FieldsExpression, GetOptions } from "@subql/types-core";
import assert from 'assert';



export type DailyStatisticProps = Omit<DailyStatistic, NonNullable<FunctionPropertyNames<DailyStatistic>> | '_name'>;

/*
 * Compat types allows for support of alternative `id` types without refactoring the node
 */
type CompatDailyStatisticProps = Omit<DailyStatisticProps, 'id'> & { id: string; };
type CompatEntity = Omit<Entity, 'id'> & { id: string; };

export class DailyStatistic implements CompatEntity {

    constructor(
        
        id: string,
        date: Date,
        totalTransactions: number,
        totalTransfers: number,
        totalDelegations: number,
        totalUndelegations: number,
        uniqueActiveAccounts: number,
        totalIBCTransfers: number,
    ) {
        this.id = id;
        this.date = date;
        this.totalTransactions = totalTransactions;
        this.totalTransfers = totalTransfers;
        this.totalDelegations = totalDelegations;
        this.totalUndelegations = totalUndelegations;
        this.uniqueActiveAccounts = uniqueActiveAccounts;
        this.totalIBCTransfers = totalIBCTransfers;
        
    }

    public id: string;
    public date: Date;
    public totalTransactions: number;
    public totalTransfers: number;
    public totalDelegations: number;
    public totalUndelegations: number;
    public uniqueActiveAccounts: number;
    public totalIBCTransfers: number;
    public totalVolume?: string;
    public avgBlockTime?: number;
    public totalFees?: string;
    public totalFeesByDenom?: string;
    

    get _name(): string {
        return 'DailyStatistic';
    }

    async save(): Promise<void> {
        const id = this.id;
        assert(id !== null, "Cannot save DailyStatistic entity without an ID");
        await store.set('DailyStatistic', id.toString(), this as unknown as CompatDailyStatisticProps);
    }

    static async remove(id: string): Promise<void> {
        assert(id !== null, "Cannot remove DailyStatistic entity without an ID");
        await store.remove('DailyStatistic', id.toString());
    }

    static async get(id: string): Promise<DailyStatistic | undefined> {
        assert((id !== null && id !== undefined), "Cannot get DailyStatistic entity without an ID");
        const record = await store.get('DailyStatistic', id.toString());
        if (record) {
            return this.create(record as unknown as DailyStatisticProps);
        } else {
            return;
        }
    }

    static async getByDate(date: Date, options: GetOptions<CompatDailyStatisticProps>): Promise<DailyStatistic[]> {
        // Inputs must be cast as the store interface has not been updated to support alternative ID types
        const records = await store.getByField<CompatDailyStatisticProps>('DailyStatistic', 'date', date, options);
        return records.map(record => this.create(record as unknown as DailyStatisticProps));
    }
    


    /**
     * Gets entities matching the specified filters and options.
     *
     * ⚠️ This function will first search cache data followed by DB data. Please consider this when using order and offset options.⚠️
     * */
    static async getByFields(filter: FieldsExpression<DailyStatisticProps>[], options: GetOptions<DailyStatisticProps>): Promise<DailyStatistic[]> {
        const records = await store.getByFields<CompatDailyStatisticProps>('DailyStatistic', filter  as unknown as FieldsExpression<CompatDailyStatisticProps>[], options as unknown as GetOptions<CompatDailyStatisticProps>);
        return records.map(record => this.create(record as unknown as DailyStatisticProps));
    }

    static create(record: DailyStatisticProps): DailyStatistic {
        assert(record.id !== undefined && record.id !== null, "id must be provided");
        const entity = new this(
            record.id,
            record.date,
            record.totalTransactions,
            record.totalTransfers,
            record.totalDelegations,
            record.totalUndelegations,
            record.uniqueActiveAccounts,
            record.totalIBCTransfers,
        );
        Object.assign(entity,record);
        return entity;
    }
}
