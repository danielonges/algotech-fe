import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/pages/sales/orders.scss';
import '../../styles/common/common.scss';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Collapse,
  Box,
  Grid,
  Chip
} from '@mui/material';
import {
  Search,
  Download,
  FilterList,
  KeyboardArrowUp,
  KeyboardArrowDown
} from '@mui/icons-material';
import { PlatformType, SalesOrder } from 'src/models/types';
import { createSearchParams, useNavigate } from 'react-router-dom';
import salesContext from 'src/context/sales/salesContext';

let platforms = Object.keys(PlatformType).filter((v) => isNaN(Number(v)));
platforms.unshift('ALL');

const Row = ({ row }: { row: SalesOrder }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);

  const navToViewSalesOrder = () => {
    navigate({
      pathname: '/sales/salesOrderDetails',
      search: createSearchParams({
        id: row?.id.toString()
      }).toString()
    });
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align='center'>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row' align='center'>
          {row.customerName}
        </TableCell>

        <TableCell align='center'>
          <Chip
            label={
              row.orderStatus.charAt(0).toUpperCase() +
              row.orderStatus.slice(1).toLowerCase()
            }
          />
        </TableCell>
        <TableCell align='center'>
          <Chip
            label={row.platformType.toUpperCase()}
            color={
              row.platformType === PlatformType.SHOPEE
                ? 'warning'
                : row.platformType === PlatformType.SHOPIFY
                ? 'primary'
                : 'info'
            }
          />
        </TableCell>
        <TableCell align='center'>${row.amount.toFixed(2)}</TableCell>
        <TableCell align='center'>{row.customerAddress ?? 'NA'}</TableCell>
        <TableCell align='center'>
          <Button
            variant='contained'
            size='large'
            sx={{ height: 'fit-content' }}
            onClick={() => navToViewSalesOrder()}
          >
            Manage Order
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={!open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: '2%' }}>
              <div className='grid-toolbar'>
                <h3>Order Details</h3>
                <h3>Order ID.: #{row.orderId}</h3>
              </div>

              {row.salesOrderItems?.map((item) => {
                return (
                  <>
                    <Grid
                      container
                      spacing={1}
                      style={{ alignItems: 'center' }}
                    >
                      <Grid item xs={3}>
                        {item.productName ?? 'NA'} x{item.quantity}, $
                        {item.price.toFixed(2)}
                      </Grid>
                      <Grid item xs={1}>
                        ${(item.quantity * item.price).toFixed(2)}
                      </Grid>
                    </Grid>
                  </>
                );
              })}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const AllSalesOrders = () => {
  const { salesOrders, refreshSalesOrder } = React.useContext(salesContext);
  const [searchField, setSearchField] = useState<string>('');
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    refreshSalesOrder(() => setLoading(false));

    if(salesOrders) {

    }
  }, []);

  const filteredData = useMemo(
    () =>
      (filterPlatform || searchField) && filterPlatform !== 'ALL'
        ? salesOrders.filter(
            (saleOrder) =>
              (!filterPlatform || saleOrder.platformType === filterPlatform) &&
              Object.values(saleOrder).some((value) =>
                String(value).toLowerCase().match(searchField.toLowerCase())
              )
          )
        : salesOrders,
    [salesOrders, filterPlatform, searchField]
  );

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };
  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterPlatform(event.target.value);
  };

  return (
    <div className='orders'>
      <h1>All Orders</h1>
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <FilterList />
          <Select
            style={{ width: '50%' }}
            value={filterPlatform}
            label='Filter'
            defaultValue='ALL'
            placeholder='Platform'
            onChange={handleFilterChange}
          >
            {platforms.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Search />
          <TextField
            id='search'
            label='Search'
            fullWidth
            value={searchField}
            placeholder='Input Search Field ...'
            onChange={handleSearchFieldChange}
          />
          <Button
            variant='contained'
            size='large'
            sx={{ height: 'fit-content' }}
            onClick={() => {
              setSearchField('');
              setFilterPlatform('ALL');
            }}
          >
            Reset
          </Button>
        </div>
        <Button
          variant='contained'
          size='large'
          sx={{ height: 'fit-content' }}
          endIcon={<Download />}
          onClick={() => {}}
        >
          Download CSV
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align='center'>Order For</TableCell>
              <TableCell align='center'>Status</TableCell>
              <TableCell align='center'>Platform</TableCell>
              <TableCell align='center'>Order Amount</TableCell>
              <TableCell align='center'>Delivery Details</TableCell>
              <TableCell align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((salesOrder) => (
              <Row key={salesOrder.id} row={salesOrder} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllSalesOrders;
