import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Modal, useToast } from "@/components/ui/shared"
import { ShoppingBag, Coins, Check } from "lucide-react"
import { SHOP_ITEMS, RARITY_CONFIG, type ShopItem } from "@/lib/studentData"
import { getAvailablePoints, spendPoints, getInventory, addToInventory, getEquipped, equipItem } from "@/lib/studentStore"

type CategoryFilter = "all" | "costume" | "accessory" | "title"

const CATS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "costume", label: "装扮" },
  { key: "accessory", label: "饰品" },
  { key: "title", label: "称号" },
]

export default function StudentShopPage() {
  const [cat, setCat] = useState<CategoryFilter>("all")
  const [confirm, setConfirm] = useState<ShopItem | null>(null)
  const [points, setPoints] = useState(getAvailablePoints)
  const [inv, setInv] = useState<string[]>(getInventory)
  const [equipped, setEquipped] = useState(getEquipped)
  const { toast } = useToast()

  const items = useMemo(() =>
    SHOP_ITEMS.filter(i => cat === "all" || i.category === cat)
  , [cat])

  const refresh = () => { setPoints(getAvailablePoints()); setInv(getInventory()); setEquipped(getEquipped()) }

  const handlePurchase = (item: ShopItem) => {
    spendPoints(item.price)
    addToInventory(item.id)
    refresh()
    setConfirm(null)
    toast(`购买成功：${item.name}`, "success")
  }

  const handleEquip = (item: ShopItem) => {
    equipItem(item.category, item.id)
    refresh()
    toast(`已装备：${item.name}`, "success")
  }

  const getStatus = (item: ShopItem) => {
    if (equipped[item.category] === item.id) return "equipped"
    if (inv.includes(item.id)) return "owned"
    if (points >= item.price) return "buyable"
    return "insufficient"
  }

  return (
    <div className="animate-fade-in">
      <header className="gradient-magic px-5 pt-10 pb-5 md:pt-8 md:rounded-b-2xl">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingBag className="w-5 h-5 text-white/80" />
          <h1 className="text-xl font-bold text-white">积分商城</h1>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <Coins className="w-4 h-4 text-amber-300" />
          <span className="text-white font-bold">{points}</span>
          <span className="text-white/60 text-sm">可用积分</span>
        </div>
      </header>

      <div className="px-4 md:px-6 -mt-4 space-y-4 pb-4">
        {/* Category filter */}
        <Card className="border-0">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 justify-center">
              {CATS.map(c => (
                <button key={c.key} onClick={() => setCat(c.key)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    cat === c.key ? "gradient-magic text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Items grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map(item => {
            const rarity = RARITY_CONFIG[item.rarity]
            const status = getStatus(item)
            return (
              <Card key={item.id} className="border-0 hover:shadow-glow transition-shadow">
                <CardContent className="p-4 text-center">
                  <span className="text-4xl block mb-2">{item.icon}</span>
                  <p className="font-semibold text-sm mb-1">{item.name}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-medium mb-2 ${rarity.color}`}>
                    {rarity.label}
                  </span>
                  <p className="text-[10px] text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                  {status === "equipped" ? (
                    <div className="h-8 rounded-lg bg-success/10 text-success text-xs font-medium flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 装备中
                    </div>
                  ) : status === "owned" ? (
                    <button onClick={() => handleEquip(item)}
                      className="w-full h-8 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20">
                      装备
                    </button>
                  ) : status === "buyable" ? (
                    <button onClick={() => setConfirm(item)}
                      className="w-full h-8 rounded-lg gradient-magic text-white text-xs font-semibold hover:opacity-90">
                      <span className="flex items-center justify-center gap-1">
                        <Coins className="w-3 h-3" /> {item.price}
                      </span>
                    </button>
                  ) : (
                    <div className="h-8 rounded-lg bg-muted text-muted-foreground text-xs flex items-center justify-center">
                      <span className="flex items-center gap-1"><Coins className="w-3 h-3" /> {item.price}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Purchase confirmation */}
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="确认购买">
        {confirm && (
          <div className="text-center space-y-4">
            <span className="text-5xl block">{confirm.icon}</span>
            <p className="font-semibold">{confirm.name}</p>
            <p className="text-sm text-muted-foreground">{confirm.description}</p>
            <div className="flex items-center justify-center gap-1 text-amber-600 font-bold">
              <Coins className="w-4 h-4" /> {confirm.price} 积分
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)}
                className="flex-1 h-10 rounded-lg border text-sm font-medium hover:bg-muted">
                取消
              </button>
              <button onClick={() => handlePurchase(confirm)}
                className="flex-1 h-10 rounded-lg gradient-magic text-white text-sm font-semibold hover:opacity-90">
                确认购买
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
