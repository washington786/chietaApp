import colors from "@/config/colors"
import { DiscretionaryWindow } from "../models/DiscretionaryDto"
import { Ionicons } from "@expo/vector-icons"

// type: upcomings
export type GrantType = 'discretionary' | 'mandatory'

// ─── Helpers ─────────────────────────────────────────────────────────────────────
export const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })

export const daysUntil = (iso: string): number => {
    const diff = new Date(iso).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export const daysLabel = (days: number): string => {
    if (days === 0) return 'Launches today'
    if (days === 1) return '1 day to launch'
    return `${days} days to launch`
}

export const daysChipColor = (days: number): string => {
    if (days <= 7) return colors.primary[600]
    if (days <= 30) return colors.primary[700]
    return colors.primary[800]
}

// ─── Event Card ───────────────────────────────────────────────────────────────────
export interface EventCardProps {
    item: DiscretionaryWindow
    index: number
}

// ─── Toggle ───────────────────────────────────────────────────────────────────────
export interface ToggleProps {
    value: GrantType
    onChange: (v: GrantType) => void
}

export const TOGGLE_OPTIONS: {
    type: GrantType
    label: string
    sublabel: string
    icon: keyof typeof Ionicons.glyphMap
    iconActive: keyof typeof Ionicons.glyphMap
}[] = [
        {
            type: 'discretionary',
            label: 'Discretionary',
            sublabel: 'Project grants',
            icon: 'layers-outline',
            iconActive: 'layers',
        },
        {
            type: 'mandatory',
            label: 'Mandatory',
            sublabel: 'Levy grants',
            icon: 'shield-checkmark-outline',
            iconActive: 'shield-checkmark',
        },
    ]