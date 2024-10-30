import { Table, TableProps } from "antd";
import { IDataSource, IPropertiesTabProps } from "./PropertiesTab.interface";

const PropertiesTab = ({ elementDetails }: IPropertiesTabProps) => {
    const columns: TableProps<IDataSource>['columns'] = [
        {
            title: 'Field',
            dataIndex: 'field',
            key: 'field',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        }]

    return (
        <>
            <h1>Properties</h1>
            <div style={{ marginTop: '20px' }}>
                {elementDetails ? (
                    <Table<IDataSource>
                        columns={columns}
                        dataSource={elementDetails}
                        size="small"
                        bordered
                        showHeader={false}
                        pagination={false} />
                ) : (
                    <p>Click on any element to view details.</p>
                )}
            </div>
        </>
    )
}

export default PropertiesTab;