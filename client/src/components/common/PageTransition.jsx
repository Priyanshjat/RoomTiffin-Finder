import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useSelector } from 'react-redux'

const sectionVariants = {
  default: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  },
  rooms: {
    initial: { opacity: 0, y: 24, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: 16, transition: { duration: 0.25 } }
  },
  tiffin: {
    initial: { opacity: 0, scale: 0.96, rotate: -0.5 },
    animate: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.38, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
  },
  ai: {
    initial: { opacity: 0, scale: 0.98, filter: 'brightness(1.2)' },
    animate: { opacity: 1, scale: 1, filter: 'brightness(1)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }
}

const PageTransition = ({ children, variant = 'default', className = '' }) => {
  const shouldReduceMotion = useReducedMotion()
  const reduxReducedMotion = useSelector((state) => state.ui.reduceMotion)
  const isReduced = shouldReduceMotion || reduxReducedMotion

  if (isReduced) {
    return <div className={className}>{children}</div>
  }

  const selectedVariant = sectionVariants[variant] || sectionVariants.default

  return (
    <motion.div
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
