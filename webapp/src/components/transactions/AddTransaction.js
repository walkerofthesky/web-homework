import { useMutation } from '@apollo/client'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import AddTransactionGQL from '../../gql/addTransaction.gql'

const DOLLAR_REGEX = /^[0-9]+(.[0-9][0-9])?$/
const FORM_FIELDS_DEFAULT = {
  user_id: '',
  description: '',
  merchant_id: '',
  debit: true,
  credit: false,
  amount: ''
}

export const AddTransaction = ({ refreshTable }) => {
  const [open, setOpen] = useState(false)
  const [formFields, setFormFields] = useState(FORM_FIELDS_DEFAULT)
  const [transactionType, setTransactionType] = useState('debit')
  const [hasSubmitError, setHasSubmitError] = useState(false)
  const [userIdError, setUserIdError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [merchantIdError, setMerchantIdError] = useState('')
  const [amountError, setAmountError] = useState('')
  const [addTransaction, { data, loading, error }] = useMutation(AddTransactionGQL)

  const handleChangeTransactionType = (e) => {
    const { value } = e.target

    setTransactionType(value)
    setFormFields({
      ...formFields,
      debit: value === 'debit',
      credit: value === 'credit'
    })
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleFormUpdate = (e) => {
    const { id, value } = e.target

    setFormFields({
      ...formFields,
      [id]: value
    })
  }

  const handleOpenDialog = () => {
    setOpen(true)
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

    addTransaction({
      variables: {
        ...formFields,
        amount: parseFloat(formFields.amount)
      }
    })
  }

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
    if (!data) return
    refreshTable()
    handleClose()
    setFormFields(FORM_FIELDS_DEFAULT)
  }, [data])

  if (error) {
    console.error('error', error)
  }

  return (
    <>
      <Button onClick={handleOpenDialog}>Add Transaction</Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
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
          <Button disabled={loading} onClick={handleClose}>Cancel</Button>
          <Button disabled={loading} onClick={handleSubmit} variant='contained'>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

AddTransaction.propTypes = {
  refreshTable: PropTypes.func
}
