import { useState, useRef } from 'react'
import '../styles/InsuranceScanner.css'

interface ScannerProps {
  onScanComplete: (insuranceNumber: string) => void
}

function InsuranceScanner({ onScanComplete }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [manualInput, setManualInput] = useState('')

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
      }
    } catch (err) {
      alert('Không thể truy cập camera. Vui lòng nhập số thẻ bảo hiểm thủ công.')
      console.error('Camera error:', err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      setIsScanning(false)
    }
  }

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        // Tại đây bạn có thể thêm logic OCR để nhận diện số thẻ
        // Hiện tại chỉ demo
        alert('Ảnh đã được chụp. (Cần thêm OCR library để nhận diện)')
      }
    }
  }

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onScanComplete(manualInput)
      setManualInput('')
      stopCamera()
    }
  }

  return (
    <div className="insurance-scanner">
      <h3>📱 Quét Thẻ Bảo Hiểm Y Tế</h3>
      
      {!isScanning ? (
        <div className="scanner-input-section">
          <button className="btn-scan-camera" onClick={startCamera}>
            🎥 Bật Camera Quét
          </button>
          
          <div className="divider">hoặc</div>

          <div className="manual-input-group">
            <label>Nhập Số Thẻ Bảo Hiểm</label>
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="VD: BH123456789"
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
            />
            <button className="btn-submit-manual" onClick={handleManualSubmit}>
              ✓ Xác Nhận
            </button>
          </div>
        </div>
      ) : (
        <div className="scanner-active-section">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="scanner-video"
          />
          <canvas
            ref={canvasRef}
            width={320}
            height={240}
            style={{ display: 'none' }}
          />
          <div className="scanner-controls">
            <button className="btn-capture" onClick={captureFrame}>
              📸 Chụp Ảnh
            </button>
            <button className="btn-close" onClick={stopCamera}>
              ✕ Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InsuranceScanner
