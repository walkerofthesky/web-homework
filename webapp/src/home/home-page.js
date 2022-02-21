import { useQuery } from '@apollo/client'
import React, { Fragment } from 'react'

import GetTransactions from '../gql/transactions.gql'
import { TxTable } from '../components/transactions/TxTable'
import { AddTransaction } from '../components/transactions/AddTransaction'

export function Home () {
  const { loading, error, data = {}, refetch } = useQuery(GetTransactions)

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
      <TxTable data={data.transactions} />
      <AddTransaction refreshTable={refetch} />
    </Fragment>
  )
}
