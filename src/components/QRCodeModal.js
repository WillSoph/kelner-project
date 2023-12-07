'use client'
import { useModal } from 'react-modal-hook'
import QRCode from 'qrcode.react'

export default function QRCodeModal({ cardapioLink }) {
  const [showModal, hideModal] = useModal(() => (
    <div className="modal">
      <div className="modal-content">
        <h2>QRCode do Cardápio</h2>
        <QRCode value={cardapioLink} />
        <button onClick={hideModal}>Fechar Modal</button>
        <button onClick={() => window.print()}>Imprimir QRCode</button>
      </div>
    </div>
  ))

  return (
    <div>
      <button onClick={showModal}>QRCode</button>
    </div>
  )
}
