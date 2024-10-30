export interface IDataSource {
    field: string;
    value: string;
}

export interface IPropertiesTabProps {
    elementDetails: IDataSource[] | undefined;
}