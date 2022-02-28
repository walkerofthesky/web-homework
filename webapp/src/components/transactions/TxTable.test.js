import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { TxTable, makeDataTestId } from './TxTable'
import { transactions } from '../../../mocks/transactions-data'

const mockDeleteFn = jest.fn()
const mockEditFn = jest.fn()

describe('Transactions Table', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show user "employee4" with amount "150"', () => {
    render(<TxTable data={transactions} deleteTransaction={mockDeleteFn} editTransaction={mockEditFn} />)
    expect(screen.getByTestId(makeDataTestId(transactions[0].id, 'amount'))).toHaveTextContent('150')
  })

  it('should send the transaction to the edit function on click of edit button', () => {
    render(<TxTable data={transactions} deleteTransaction={mockDeleteFn} editTransaction={mockEditFn} />)
    const editButton = screen.getByTestId(makeDataTestId(transactions[1].id, 'edit'))
    fireEvent.click(editButton)
    expect(mockEditFn).toHaveBeenCalledWith(transactions[1])
  })

  it('should send the transaction id to the delete function on click of delete button', () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true)
    render(<TxTable data={transactions} deleteTransaction={mockDeleteFn} editTransaction={mockEditFn} />)

    const deleteButton = screen.getByTestId(makeDataTestId(transactions[2].id, 'delete'))
    fireEvent.click(deleteButton)

    expect(window.confirm).toHaveBeenCalledWith(`Do you wish to delete transaction ${transactions[2].id}?`)
    expect(mockDeleteFn).toHaveBeenCalledWith(transactions[2].id)
  })

  it('should not call the delete function on click of delete button if confirm is false', () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => false)
    render(<TxTable data={transactions} deleteTransaction={mockDeleteFn} editTransaction={mockEditFn} />)

    const deleteButton = screen.getByTestId(makeDataTestId(transactions[2].id, 'delete'))
    fireEvent.click(deleteButton)

    expect(window.confirm).toHaveBeenCalledWith(`Do you wish to delete transaction ${transactions[2].id}?`)
    expect(mockDeleteFn).not.toHaveBeenCalled()
  })
})
