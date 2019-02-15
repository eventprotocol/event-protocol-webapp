import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import DataFetchComponent from "../../drizzle-components/CustomContracts/custom-data-fetcher.js";


import Web3 from 'web3';
import EventContract from "../../data/EventContract.json";
import EventToken from "../../data/EventToken.json";

// ETHEREUM CODE //
var BigNumber = require('bignumber.js');

// get abi
let event_abi = EventContract.abi;
let token_abi = EventToken.abi;
// get address at rinkeby "4"
let contractAddress = EventContract.networks['4'].address;

let web3;

// setup the system
if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // We are in the browser and metamask is running.
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/orDImgKRzwNrVCDrAk5Q"
  );
  web3 = new Web3(provider);
}
const EventContractInst = new web3.eth.Contract(event_abi, contractAddress);
// ETHEREUM CODE //



const styles = theme => ({
	table: {
		fontFamily: theme.typography.fontFamily,
	},
	flexContainer: {
		display: 'flex',
		alignItems: 'center',
		boxSizing: 'border-box',
	},
	tableRow: {
		cursor: 'pointer',
	},
	tableRowHover: {
		'&:hover': {
			backgroundColor: theme.palette.grey[200],
		},
	},
	tableCell: {
		flex: 1,
	},
	noClick: {
		cursor: 'initial',
	},
});

class MuiVirtualizedTable extends React.PureComponent {
	getRowClassName = ({ index }) => {
		const { classes, rowClassName, onRowClick } = this.props;

		return classNames(classes.tableRow, classes.flexContainer, rowClassName, {
			[classes.tableRowHover]: index !== -1 && onRowClick != null,
		});
	};

	cellRenderer = ({ cellData, columnIndex = null }) => {
		const { columns, classes, rowHeight, onRowClick } = this.props;
		return (
			<TableCell
				component="div"
				className={classNames(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ height: rowHeight }}
				align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
			>
				{cellData}
			</TableCell>
		);
	};

	headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
		const { headerHeight, columns, classes, sort } = this.props;
		const direction = {
			[SortDirection.ASC]: 'asc',
			[SortDirection.DESC]: 'desc',
		};

		const inner =
			!columns[columnIndex].disableSort && sort != null ? (
				<TableSortLabel active={dataKey === sortBy} direction={direction[sortDirection]}>
					{label}
				</TableSortLabel>
			) : (
				label
			);

		return (
			<TableCell
				component="div"
				className={classNames(classes.tableCell, classes.flexContainer, classes.noClick)}
				variant="head"
				style={{ height: headerHeight }}
				align={columns[columnIndex].numeric || false ? 'right' : 'left'}
			>
				{inner}
			</TableCell>
		);
	};

	render() {
		const { classes, columns, ...tableProps } = this.props;
		return (
			<AutoSizer>
				{({ height, width }) => (
					<Table
						className={classes.table}
						height={height}
						width={width}
						{...tableProps}
						rowClassName={this.getRowClassName}
					>
						{columns.map(({ cellContentRenderer = null, className, dataKey, ...other }, index) => {
							let renderer;
							if (cellContentRenderer != null) {
								renderer = cellRendererProps =>
									this.cellRenderer({
										cellData: cellContentRenderer(cellRendererProps),
										columnIndex: index,
									});
							} else {
								renderer = this.cellRenderer;
							}

							return (
								<Column
									key={dataKey}
									headerRenderer={headerProps =>
										this.headerRenderer({
											...headerProps,
											columnIndex: index,
										})
									}
									className={classNames(classes.flexContainer, className)}
									cellRenderer={renderer}
									dataKey={dataKey}
									{...other}
								/>
							);
						})}
					</Table>
				)}
			</AutoSizer>
		);
	}
}

MuiVirtualizedTable.propTypes = {
	classes: PropTypes.object,
	columns: PropTypes.arrayOf(
		PropTypes.shape({
			cellContentRenderer: PropTypes.func,
			dataKey: PropTypes.string,
			width: PropTypes.number,
		}),
	).isRequired,
	headerHeight: PropTypes.number,
	onRowClick: PropTypes.func,
	rowClassName: PropTypes.string,
	rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
	sort: PropTypes.func,
};

MuiVirtualizedTable.defaultProps = {
	headerHeight: 56,
	rowHeight: 56,
};

const WrappedVirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

var updatedFileList = {};
var loaded = false;

web3.eth.getAccounts().then((res) => {
	var account = res[0];
	const str = 'http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${token}';
	const obj = {address: account, token:'RA5HQDQNQXD9V1FK6ZTEJYWDGYWPAEPURC'};
	const result = new Function('const {' + Object.keys(obj).join(',') + '} = this.obj;return `' + str + '`').call({obj});

	axios.get(result).then((res) => {
		let fileList = res;
		fileList.data.result = fileList.data.result.filter((el, i) => (
			el.to === '0x7143a8faa78b56fbdfefe0cfba58016f21620bf6' || el.from === '0x7143a8faa78b56fbdfefe0cfba58016f21620bf6' || el.to === "0x89e8a23ca8bab8bef769df2c10c060dc1c30053f" || el.from === "0x89e8a23ca8bab8bef769df2c10c060dc1c30053f"
		))

		console.log(fileList);


		for(var item in fileList) {
			var event_id = "Wallet"
      var value = 0
      console.log(<DataFetchComponent contract="EventContract" method="getEventName" methodArgs={[parseInt(1), {from: this.props.eth_address}]} />)
      //tokenfallback function abi
      const tokenFallback_ = "0x95f847fd"
      const resolve_event = "0xda9db866"

      var key = item.input.slice(0, 10)
      var input = item.input.slice(10, item.input.length)

      if (key === tokenFallback_){
        event_id = web3.eth.abi.decodeParameters(token_abi[10].inputs, input)[2]
        value = new BigNumber(web3.eth.abi.decodeParameters(token_abi[10].inputs, input)[1])/(Math.pow(10, 18))
        event_id = <DataFetchComponent contract="EventContract" method="getEventName" methodArgs={[parseInt(event_id), {from: this.props.eth_address}]} />
      }

      if (key === resolve_event){
        event_id = web3.eth.abi.decodeParameters(event_abi[5].inputs, input)[0]
        event_id = <DataFetchComponent contract="EventContract" method="getEventName" methodArgs={[parseInt(event_id), {from: this.props.eth_address}]} />
      }

      var newItem = item.slice();
      newItem.push(event_id);
      newItem.push(value);
      updatedFileList.push(newItem);
		}

		loaded = true;



	}).catch((err) => {
		console.log(err);
	})

}).catch((err) => {
	console.log(err);
})


// const data = [
// 	['12 Dec 2018, 12:00', "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", 0, 10],
// 	['12 Jan 2019, 12:00', "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", 0, 100],
// 	['12 Sep 2018, 12:00', "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", 0, 23],
// 	['12 Nov 2018, 12:00', "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", 0, 31],
// 	['13 Sep 2018, 12:00', "0x0E35462535daE6fd521f0Eea67dc4e9485C714dC", "0x24eeAc4F88412DC27F4b802EA8eB8B4725cF3AF8", 0, 43],
// ];

// let id = 0;
// function createData(timestamp, _to, _from, eth_value, et_value) {
// 	id += 1;
// 	return { id, timestamp, _to, _from, eth_value, et_value };
// }

// const rows = [];

// for (let i = 0; i < 200; i += 1) {
// 	const randomSelection = data[Math.floor(Math.random() * data.length)];
// 	rows.push(createData(...randomSelection));
// }

function ReactVirtualizedTable() {
	if(loaded) {
		return(
			<Paper style={{ height: 400, width: '100%' }}>
				<WrappedVirtualizedTable
					rowCount={updatedFileList.length}
					rowGetter={({ index }) => updatedFileList[index]}
					onRowClick={event => console.log(event)}
					columns={[
						{
							width: 120,
							flexGrow: 1.0,
							label: 'Timestamp',
							dataKey: 'timestamp',
						},
						{
							width: 250,
							flexGrow: 1.0,
							label: 'To',
							dataKey: '_to',
						},
						{
							width: 250,
							flexGrow: 1.0,
							label: 'From',
							dataKey: '_from',
						},
						{
							width: 120,
							flexGrow: 1.0,
							label: 'ETH Transferred',
							dataKey: 'eth_value',
							numeric: true,
						},
						{
							width: 120,
							flexGrow: 1.0,
							label: 'ET Transferred',
							dataKey: 'et_value',
							numeric: true,
						},
					]}
				/>
			</Paper>
		);
	} else {
		return (null);
	}
}

export default ReactVirtualizedTable;