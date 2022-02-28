import { useQuery, useMutation } from '@apollo/client'
import { Button } from '@mui/material'
import React, { Fragment, useState } from 'react'

import DeleteTransaction from '../gql/deleteTransaction.gql'
import GetTransactions from '../gql/transactions.gql'
import { TxTable } from '../components/transactions/TxTable'
import { TransactionModal } from '../components/transactions/TransactionModal'

export function Home () {
  const [isTxModalOpen, setIsTxModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState()
  const { loading, error, data = {}, refetch } = useQuery(GetTransactions)
  const [ deleteTransaction ] = useMutation(DeleteTransaction, {
    refetchQueries: [
      'GetTransactions'
    ]
  })

  const handleAdd = () => {
    setSelectedTransaction()
    setIsTxModalOpen(true)
  }

  const handleDelete = (id) => {
    deleteTransaction({
      variables: {
        id
      }
    })
  }

  const handleEdit = (tx) => {
    setSelectedTransaction(tx)
    setIsTxModalOpen(true)
  }

  const handleCloseDialog = () => {
    setIsTxModalOpen(false)
    setSelectedTransaction()
  }

  if (loading) {
    return (
      <Fragment>
        Loading...
      </Fragment>
    )
  }

  if (error) {
    return (
      <Fragment>
        ¯\_(ツ)_/¯
      </Fragment>
    )
  }

  return (
    <Fragment>
      <TxTable data={data.transactions} deleteTransaction={handleDelete} editTransaction={handleEdit} />
      <Button onClick={handleAdd}>Add Transaction</Button>
      <TransactionModal
        close={handleCloseDialog}
        open={isTxModalOpen}
        refreshTable={refetch}
        transaction={selectedTransaction}
      />
    </Fragment>
  )
}
