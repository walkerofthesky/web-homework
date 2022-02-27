import React from 'react'
import { arrayOf, func, string, bool, number, shape } from 'prop-types'
import { css } from '@emotion/core'
import { Check, Delete, Edit } from '@mui/icons-material'

const styles = css`
  .edit {
    margin-right: 8px;
  }
  .header {
    font-weight: bold;
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
    <table css={styles}>
      <tbody>
        <tr className='header'>
          <td>ID</td>
          <td>User ID</td>
          <td>Description</td>
          <td>Merchant ID</td>
          <td>Debit</td>
          <td>Credit</td>
          <td>Amount</td>
          <td />
        </tr>
        {data.map(tx => {
          const { id, user_id: userId, description, merchant_id: merchantId, debit, credit, amount } = tx
          return (
            <tr data-testid={`transaction-${id}`} key={`transaction-${id}`}>
              <td data-testid={makeDataTestId(id, 'id')}>{id}</td>
              <td data-testid={makeDataTestId(id, 'userId')}>{userId}</td>
              <td data-testid={makeDataTestId(id, 'description')}>{description}</td>
              <td data-testid={makeDataTestId(id, 'merchant')}>{merchantId}</td>
              <td data-testid={makeDataTestId(id, 'debit')}>{debit && <Check />}</td>
              <td data-testid={makeDataTestId(id, 'credit')}>{credit && <Check />}</td>
              <td data-testid={makeDataTestId(id, 'amount')}>{amount}</td>
              <td data-testid={makeDataTestId(id, 'actions')}>
                <button className='edit unstyled-button' onClick={() => editTransaction(tx)}><Edit /></button>
                <button className='unstyled-button' onClick={() => handleDelete(id)}><Delete /></button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
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
