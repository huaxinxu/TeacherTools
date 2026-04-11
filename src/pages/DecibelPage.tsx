import { useState, useRef, useCallback, useEffect } from "react"
import { Mic, MicOff, Volume2, RotateCcw, Info } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const DB_LEVELS = [
  { range: "0–30", label: "极安静", desc: "图书馆、耳语", color: "bg-emerald-400" },
  { range: "30–50", label: "安静", desc: "安静教室、办公室", color: "bg-green-400" },
  { range: "50–70", label: "中等", desc: "正常交谈、课堂讨论", color: "bg-yellow-400" },
  { range: "70–85", label: "较吵", desc: "嘈杂教室、大声说话", color: "bg-orange-400" },
  { range: "85–100", label: "很吵", desc: "工厂噪音", color: "bg-red-400" },
  { range: "100+", label: "极吵", desc: "可能损伤听力", color: "bg-red-600" },
]

function dbColor(db: number) {
  if (db < 30) return "text-emerald-500"
  if (db < 50) return "text-green-500"
  if (db < 70) return "text-yellow-500"
  if (db < 85) return "text-orange-500"
  return "text-red-500"
}

function dbLabel(db: number) {
  if (db < 30) return "极安静"
  if (db < 50) return "安静"
  if (db < 70) return "中等"
  if (db < 85) return "较吵"
  if (db < 100) return "很吵"
  return "极吵"
}

function ringColor(db: number) {
  if (db < 30) return "border-emerald-400"
  if (db < 50) return "border-green-400"
  if (db < 70) return "border-yellow-400"
  if (db < 85) return "border-orange-400"
  return "border-red-400"
}

export default function DecibelPage() {
  const [isListening, setIsListening] = useState(false)
  const [currentDb, setCurrentDb] = useState(0)
  const [maxDb, setMaxDb] = useState(0)
  const [avgDb, setAvgDb] = useState(0)
  const [error, setError] = useState("")
  const [showRef, setShowRef] = useState(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const samplesRef = useRef<number[]>([])

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    analyserRef.current = null
    setIsListening(false)
  }, [])

  const reset = useCallback(() => {
    setMaxDb(0)
    setAvgDb(0)
    setCurrentDb(0)
    samplesRef.current = []
  }, [])

  const start = useCallback(async () => {
    setError("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.3
      source.connect(analyser)
      analyserRef.current = analyser

      const dataArray = new Float32Array(analyser.fftSize)
      const tick = () => {
        analyser.getFloatTimeDomainData(dataArray)
        let sumSq = 0
        for (let i = 0; i < dataArray.length; i++) {
          sumSq += dataArray[i] * dataArray[i]
        }
        const rms = Math.sqrt(sumSq / dataArray.length)
        // Convert RMS to approximate dB (calibrated for typical microphone)
        const db = Math.max(0, Math.min(120, 20 * Math.log10(rms) + 94))

        setCurrentDb(db)
        samplesRef.current.push(db)
        setMaxDb(prev => Math.max(prev, db))
        setAvgDb(
          samplesRef.current.reduce((a, b) => a + b, 0) / samplesRef.current.length
        )

        // Keep only last 600 samples (~10s at 60fps) for avg calculation
        if (samplesRef.current.length > 600) {
          samplesRef.current = samplesRef.current.slice(-600)
        }
        rafRef.current = requestAnimationFrame(tick)
      }

      setIsListening(true)
      rafRef.current = requestAnimationFrame(tick)
    } catch {
      setError("无法访问麦克风，请检查浏览器权限设置")
    }
  }, [])

  useEffect(() => {
    return () => { stop() }
  }, [stop])

  const dbRounded = Math.round(currentDb)
  const arcPercent = Math.min(currentDb / 120, 1)

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">分贝检测</h1>
          <p className="text-sm text-muted-foreground mt-0.5">实时环境噪音监测</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowRef(!showRef)}>
          <Info className="w-4 h-4 mr-1.5" /> 参考值
        </Button>
      </div>

      <div className="md:grid md:grid-cols-3 md:gap-6 space-y-6 md:space-y-0">
        {/* ── Main Meter ── */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 md:p-8 flex flex-col items-center">
              {/* Circular display */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-6">
                {/* Animated ring */}
                <div className={cn(
                  "absolute inset-0 rounded-full border-4 transition-colors duration-300",
                  isListening ? ringColor(currentDb) : "border-muted"
                )} />
                {isListening && (
                  <div className={cn(
                    "absolute inset-2 rounded-full border-2 transition-colors duration-300 animate-pulse",
                    ringColor(currentDb),
                    "opacity-40"
                  )} />
                )}

                {/* Arc fill bar (SVG) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="88" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                  <circle
                    cx="100" cy="100" r="88" fill="none"
                    stroke={currentDb < 50 ? "hsl(var(--success))" : currentDb < 70 ? "hsl(38,92%,50%)" : "hsl(0,72%,51%)"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - arcPercent)}
                    className="transition-all duration-100"
                  />
                </svg>

                <div className="text-center z-10">
                  <span className={cn("text-5xl md:text-6xl font-bold tabular-nums transition-colors", isListening ? dbColor(currentDb) : "text-muted-foreground")}>
                    {isListening ? dbRounded : "--"}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">dB</p>
                  {isListening && (
                    <p className={cn("text-sm font-medium mt-1", dbColor(currentDb))}>{dbLabel(currentDb)}</p>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <Button
                  variant={isListening ? "destructive" : "gradient"}
                  size="lg"
                  onClick={isListening ? stop : start}
                  className="min-w-[140px]"
                >
                  {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  {isListening ? "停止检测" : "开始检测"}
                </Button>
                <Button variant="outline" size="icon" onClick={reset} title="重置数据">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {error && (
                <p className="text-sm text-destructive mt-3 text-center">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">当前</p>
                <p className={cn("text-2xl md:text-3xl font-bold tabular-nums", isListening ? dbColor(currentDb) : "text-muted-foreground")}>
                  {isListening ? dbRounded : "--"}
                </p>
                <p className="text-xs text-muted-foreground">dB</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">最大值</p>
                <p className="text-2xl md:text-3xl font-bold tabular-nums text-orange-500">
                  {maxDb > 0 ? Math.round(maxDb) : "--"}
                </p>
                <p className="text-xs text-muted-foreground">dB</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">平均值</p>
                <p className="text-2xl md:text-3xl font-bold tabular-nums text-primary">
                  {avgDb > 0 ? Math.round(avgDb) : "--"}
                </p>
                <p className="text-xs text-muted-foreground">dB</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Side Panel ── */}
        <div className="space-y-4">
          {/* Volume visualization bars */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> 音量可视化
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <VolumeBar db={currentDb} active={isListening} />
            </CardContent>
          </Card>

          {/* Reference table (always visible on PC, toggle on mobile) */}
          <div className={cn("md:block", showRef ? "block" : "hidden")}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">分贝参考值</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2">
                  {DB_LEVELS.map(l => (
                    <div key={l.range} className="flex items-center gap-2 text-xs">
                      <div className={cn("w-3 h-3 rounded-full flex-shrink-0", l.color)} />
                      <span className="font-medium w-14 flex-shrink-0">{l.range}</span>
                      <span className="text-muted-foreground flex-1 truncate">{l.desc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-primary mb-1">使用提示</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>- 首次使用需允许麦克风权限</li>
                <li>- 数值为近似值，仅供参考</li>
                <li>- 适合课堂纪律管理</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ── VolumeBar sub-component ── */
function VolumeBar({ db, active }: { db: number; active: boolean }) {
  const bars = 20
  const filled = active ? Math.round((db / 120) * bars) : 0
  return (
    <div className="flex items-end gap-1 h-28 md:h-32">
      {Array.from({ length: bars }).map((_, i) => {
        const ratio = i / bars
        let color = "bg-emerald-400"
        if (ratio > 0.7) color = "bg-red-400"
        else if (ratio > 0.5) color = "bg-orange-400"
        else if (ratio > 0.35) color = "bg-yellow-400"

        return (
          <div key={i} className="flex-1 flex flex-col justify-end h-full">
            <div
              className={cn(
                "w-full rounded-t transition-all duration-75",
                i < filled ? color : "bg-muted"
              )}
              style={{ height: `${((i + 1) / bars) * 100}%` }}
            />
          </div>
        )
      })}
    </div>
  )
}
