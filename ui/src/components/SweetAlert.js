import React from 'react'
import swal from 'sweetalert'
import { inject, observer } from 'mobx-react'
import Web3Store from '../stores/Web3Store'

@inject('RootStore')
@observer
export class SweetAlert extends React.Component {
  componentWillReact() {
    const { alertStore } = this.props.RootStore

    if (alertStore.alerts.length > 0) {
      const alert = alertStore.alerts.slice()[0]
      const isAddNetwork = alert.info.id !== 1 // check not eth network. For eth, check this PR: https://github.com/ethereum/EIPs/pull/3326
      const button = isAddNetwork ? {button: {text: `Switch to ${alert.info.name}`}} : {}
      const swalConfig = {...alert, ...button}
      swal(swalConfig).then((isButtonClicked) => {
        alertStore.remove(alert)
        if (alert.messageType == alertStore.WRONG_NETWORK_ERROR) {
          this.handleNetwork(isAddNetwork, alert.info.id, isButtonClicked)
        }
      })
    }
  }

  handleNetwork(isAddNetwork, chainID, isButtonClicked) {
    if (isAddNetwork && isButtonClicked) {
      Web3Store.autoAddNetwork(chainID)
    } else {
      window.location.reload()
    }
  }

  logErrors() {
    const { alertStore } = this.props.RootStore
    const errors = alertStore.alerts.filter(alert => alert.type === 'error')
    if (errors.length) {
      console.log('Found errors:', errors.length)
    }
  }

  render() {
    this.logErrors()
    return <div style={{ display: 'none' }} />
  }
}
