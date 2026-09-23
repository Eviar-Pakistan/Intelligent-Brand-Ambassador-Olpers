import olpersLogo from '../assets/olperslogo.png'
import tapalSidebar from '../assets/tapalsidebar.png'
import tapalProduct from '../assets/olperproduct.png'
import tapalBenefitsImg from '../assets/tapal benefits.png'
import tapaOurProductImg from '../assets/tapa our product.png'
import tapalOurProductImg from '../assets/tapal our product.png'
import tapaWhyChooseUsImg from '../assets/tapa why choose us.png'
import tapalPlayNowImg from '../assets/olpers play now.jpeg'
import spinWheelImg from '../assets/spinner.png'

export type DiscoveryTile = {
  title: string
  image: string
}

export type ShopperSpinConfig = {
  wheel: string
  subtitle: string
  prizeLabels: [string, string, string]
  winAmount: string
  winDetail: string
  promoCode: string
}

export type BaGoalProduct = {
  src: string
  alt: string
  position?: string
  scale?: string
}

export type BrandConfig = {
  label: string
  productName: string
  tagline: string
  logo: string
  sidebar: string
  shopperProduct: string
  shopperHeadline: [string, string]
  shopperDiscoveryTitle: string
  shopperDiscoveryTiles: DiscoveryTile[]
  shopperPlayNow: string
  shopperSpin: ShopperSpinConfig
  baGoalProducts: BaGoalProduct[]
  loginEmail: string
  sidebarOverlay: string
}

export const brand: BrandConfig = {
  label: 'Olpers',
  productName: 'Olpers',
  tagline: "Pakistan's No.1 UHT Milk",
  logo: olpersLogo,
  sidebar: tapalSidebar,
  shopperProduct: tapalProduct,
  shopperHeadline: ['Rich & Creamy', 'Every Day.'],
  shopperDiscoveryTitle: 'Discover Olpers',
  shopperDiscoveryTiles: [
    { title: 'Health Benefits', image: tapalBenefitsImg },
    { title: 'Olpers Milk', image: tapaOurProductImg },
    { title: 'Our Products', image: tapalOurProductImg },
    { title: 'Why Choose Us', image: tapaWhyChooseUsImg },
  ],
  shopperPlayNow: tapalPlayNowImg,
  shopperSpin: {
    wheel: spinWheelImg,
    subtitle: 'Exciting prizes for milk lovers!',
    prizeLabels: ['Rich & Creamy', 'Free Milk Sample', 'Rs. 100 Coupon'],
    winAmount: 'Rs. 100 OFF',
    winDetail: 'on your next Olpers purchase',
    promoCode: 'OLPERS100',
  },
  baGoalProducts: [
    { src: tapaOurProductImg, alt: 'Olpers Milk', scale: '1.1' },
    { src: tapalProduct, alt: 'Olpers collection', position: '50% center', scale: '1.15' },
    { src: tapalOurProductImg, alt: 'Olpers product range', position: '35% center', scale: '1.25' },
  ],
  loginEmail: 'headoffice@olpers.com',
  sidebarOverlay: 'from-red-950/35 via-red-900/20 to-red-950/88',
}
