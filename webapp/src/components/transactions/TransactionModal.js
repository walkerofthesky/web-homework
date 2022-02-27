import { useMutation } from '@apollo/client'
import { css } from '@emotion/core'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import AddTransactionGQL from '../../gql/addTransaction.gql'
import EditTransaction from '../../gql/editTransaction.gql'

const DOLLAR_REGEX = /^[0-9]+(.[0-9][0-9])?$/
const FORM_FIELDS_DEFAULT = {
  user_id: '',
  description: '',
  merchant_id: '',
  debit: true,
  credit: false,
  amount: ''
}
const TRANSACTION_TYPE_DEFAULT = FORM_FIELDS_DEFAULT.credit ? 'credit' : 'debit'

const styles = css`
  .form {
    & .MuiFormControl-root {
      margin: 5px 0 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`

export const TransactionModal = ({ close, open, refreshTable, transaction }) => {
  const [formFields, setFormFields] = useState(FORM_FIELDS_DEFAULT)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [transactionType, setTransactionType] = useState(TRANSACTION_TYPE_DEFAULT)
  const [hasSubmitError, setHasSubmitError] = useState(false)
  const [userIdError, setUserIdError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [merchantIdError, setMerchantIdError] = useState('')
  const [amountError, setAmountError] = useState('')
  const [addTransaction, addRes] = useMutation(AddTransactionGQL)
  const [editTransaction, editRes] = useMutation(EditTransaction)

  const handleChangeTransactionType = (e) => {
    const { value } = e.target

    setTransactionType(value)
    setFormFields({
      ...formFields,
      debit: value === 'debit',
      credit: value === 'credit'
    })
  }

  const handleFormUpdate = (e) => {
    const { id, value } = e.target

    setFormFields({
      ...formFields,
      [id]: value
    })
  }

  const validateForm = () => {
    let isValid = true
    if (!formFields.description || !formFields.merchant_id || !formFields.user_id) {
      isValid = false
    }

    if (!formFields.amount.match(DOLLAR_REGEX)) {
      isValid = false
    }

    setHasSubmitError(!isValid)
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return
    setIsFormSubmitted(true)

    if (transaction?.id) {
      const { __typename, id, amount, ...updateData } = formFields
      editTransaction({
        variables: {
          id,
          updateData: {
            ...updateData,
            amount: parseFloat(amount)
          }
        }
      })
      return
    }

    addTransaction({
      variables: {
        ...formFields,
        amount: parseFloat(formFields.amount)
      }
    })
  }

  useEffect(() => {
    if (!transaction) {
      setFormFields({ ...FORM_FIELDS_DEFAULT })
      setTransactionType(TRANSACTION_TYPE_DEFAULT)
      return
    }

    setFormFields({
      ...transaction,
      amount: transaction.amount.toString()
    })
    setTransactionType(transaction.credit ? 'credit' : 'debit')
  }, [transaction])

  useEffect(() => {
    setUserIdError(hasSubmitError && !formFields.user_id ? 'Required' : '')
    setDescriptionError(hasSubmitError && !formFields.description ? 'Required' : '')
    setMerchantIdError(hasSubmitError && !formFields.merchant_id ? 'Required' : '')
    if (hasSubmitError && formFields.amount === '') {
      setAmountError('Required')
    } else if (hasSubmitError && !formFields.amount.match(DOLLAR_REGEX)) {
      setAmountError('Use correct format, e.g. 200 or 1.79')
    } else {
      setAmountError('')
    }
  }, [hasSubmitError, formFields])

  // Refresh the table after a successful addTransaction
  useEffect(() => {
    if (!isFormSubmitted || addRes.loading || editRes.loading) return
    setIsFormSubmitted(false)
    refreshTable()
    close()
  }, [addRes.loading, editRes.loading, isFormSubmitted])

  if (addRes.error || editRes.error) {
    console.error('error', addRes.error || editRes.error)
  }

  return (
    <Dialog css={styles} onClose={close} open={open}>
      <DialogTitle>Add Transaction</DialogTitle>
      <DialogContent>
        <form className='form' onSubmit={handleSubmit}>
          <TextField error={!!userIdError} fullWidth helperText={userIdError} id='user_id' label='User ID' onChange={handleFormUpdate} value={formFields.user_id} />
          <TextField error={!!descriptionError} fullWidth helperText={descriptionError} id='description' label='Description' onChange={handleFormUpdate} value={formFields.description} />
          <TextField error={!!merchantIdError} fullWidth helperText={merchantIdError} id='merchant_id' label='Merchant ID' onChange={handleFormUpdate} value={formFields.merchant_id} />
          <FormControl>
            <FormLabel id='transaction_type_label'>Transaction Type</FormLabel>
            <RadioGroup
              aria-labelledby='transaction_type_label'
              name='transaction_type'
              onChange={handleChangeTransactionType}
              value={transactionType}
            >
              <FormControlLabel control={<Radio />} label='Debit' value='debit' />
              <FormControlLabel control={<Radio />} label='Credit' value='credit' />
            </RadioGroup>
          </FormControl>
          <TextField error={!!amountError} fullWidth helperText={amountError} id='amount' inputProps={{ inputMode: 'numeric', pattern: DOLLAR_REGEX }} label='Amount' onChange={handleFormUpdate} value={formFields.amount} />
        </form>
      </DialogContent>
      <DialogActions>
        <Button disabled={editRes.loading || addRes.loading} onClick={close}>Cancel</Button>
        <Button disabled={editRes.loading || addRes.loading} onClick={handleSubmit} variant='contained'>
          {transaction?.id ? 'Edit' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>

  )
}

TransactionModal.propTypes = {
  close: PropTypes.func.isRequired,
  open: PropTypes.bool,
  refreshTable: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    user_id: PropTypes.string,
    description: PropTypes.string,
    merchant_id: PropTypes.string,
    debit: PropTypes.bool,
    credit: PropTypes.bool,
    amount: PropTypes.number
  })
}
