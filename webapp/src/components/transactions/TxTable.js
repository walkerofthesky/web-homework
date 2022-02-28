import React from 'react'
import { arrayOf, func, string, bool, number, shape } from 'prop-types'
import { css } from '@emotion/core'
import {
  Check,
  Delete,
  Edit
} from '@mui/icons-material'
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@mui/material'

const styles = css`
  margin-bottom: 12px;

  .edit {
    margin-right: 8px;
  }
  .header {
    background: #f6f4e9;
    .MuiTableCell-root {
      font-weight: bold;
      white-space: nowrap;

      // keep the action icons from wrapping
      &:last-child {
        min-width: 80px;
      }
    }
  }
  .unstyled-button {
    background: none;
    border: none;
    cursor: pointer;
  }
`

const makeDataTestId = (transactionId, fieldName) => `transaction-${transactionId}-${fieldName}`

export function TxTable ({ data, deleteTransaction, editTransaction }) {
  const handleDelete = (id) => {
    if (window.confirm(`Do you wish to delete transaction ${id}?`)) {
      deleteTransaction(id)
    }
  }

  return (
    <Table aria-label='Transaction Table' css={styles}>
      <TableHead>
        <TableRow className='header'>
          <TableCell>ID</TableCell>
          <TableCell>User ID</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Merchant ID</TableCell>
          <TableCell>Debit</TableCell>
          <TableCell>Credit</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(tx => {
          const { id, user_id: userId, description, merchant_id: merchantId, debit, credit, amount } = tx
          return (
            <TableRow data-testid={`transaction-${id}`} key={`transaction-${id}`}>
              <TableCell data-testid={makeDataTestId(id, 'id')}>{id}</TableCell>
              <TableCell data-testid={makeDataTestId(id, 'userId')}>{userId}</TableCell>
              <TableCell data-testid={makeDataTestId(id, 'description')}>{description}</TableCell>
              <TableCell data-testid={makeDataTestId(id, 'merchant')}>{merchantId}</TableCell>
              <TableCell data-testid={makeDataTestId(id, 'debit')}>{debit && <Check />}</TableCell>
              <TableCell data-testid={makeDataTestId(id, 'credit')}>{credit && <Check />}</TableCell>
              <TableCell data-testid={makeDataTestId(id, 'amount')}>{amount}</TableCell>
              <TableCell data-testid={makeDataTestId(id, 'actions')}>
                <button className='edit unstyled-button' onClick={() => editTransaction(tx)}><Edit /></button>
                <button className='unstyled-button' onClick={() => handleDelete(id)}><Delete /></button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

TxTable.propTypes = {
  data: arrayOf(
    shape({
      id: string,
      user_id: string,
      description: string,
      merchant_id: string,
      debit: bool,
      credit: bool,
      amount: number
    })
  ),
  deleteTransaction: func.isRequired,
  editTransaction: func.isRequired
}
