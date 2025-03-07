import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import DeliveryCellAction from 'src/components/delivery/DeliveryCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { DeliveryOrder } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllDeliveries } from 'src/services/deliveryServices';
import { useNavigate } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Delivery ID', flex: 1 },
  { field: 'deliveryStatus', headerName: 'Delivery Status', flex: 1 },
  { field: 'shippingAddress', headerName: 'Address', flex: 1 },
  { field: 'shippingDate', headerName: 'Order Date', flex: 1 },
  { field: 'eta', headerName: 'Delivery Date', flex: 1 },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: DeliveryCellAction
  }
];

const DeliveryAssignment = () => {
  const navigate = useNavigate();

  const [searchField, setSearchField] = React.useState<string>('');
  const [deliveryData, setDeliveryData] = React.useState<DeliveryOrder[]>([]);
  const [filteredData, setFilteredData] = React.useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    // TODO: implement error callback
    setLoading(true);
    asyncFetchCallback(
      getAllDeliveries(),
      (res) => {
        setLoading(false);
        setDeliveryData(res);
      },
      () => setLoading(false)
    );
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? deliveryData.filter((category) =>
            Object.values(category).some((value) =>
              String(value).toLowerCase().match(searchField.toLowerCase())
            )
          )
        : deliveryData
    );
  }, [searchField, deliveryData]);

  console.log(filteredData);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // here
    setSearchField(e.target.value);
  };

  return (
    <div className='delivery-orders'>
      <h1>My Assigned Deliveries</h1>
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <Search />
          <TextField
            id='search'
            label='Search'
            margin='normal'
            fullWidth
            onChange={handleSearchFieldChange}
          />
        </div>
      </div>
      <DataGrid
        columns={columns}
        rows={filteredData}
        autoHeight
        loading={loading}
      />
      <br></br>
      <MapContainer
        center={[1.3667, 103.8]}
        zoom={12}
        minZoom={11}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
          url='https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png'
        />
      </MapContainer>
    </div>
    
  );
};

export default DeliveryAssignment;
