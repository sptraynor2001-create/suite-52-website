import { useEffect, useState } from 'react'
import { activeFont } from '@/design/fonts'

interface CodeLine {
  id: number
  content: string
  speed: number
  direction: 'left' | 'right'
  opacity: number
}

function FallingCode() {
  const [codeLines, setCodeLines] = useState<CodeLine[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)

  // Track viewport height changes
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Generate random opacity with normal distribution
    // Using Box-Muller transform for gaussian distribution
    const generateRandomOpacity = () => {
      const mean = 0.045
      const stdDev = 0.015
      
      // Box-Muller transform for normal distribution
      const u1 = Math.random()
      const u2 = Math.random()
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
      
      // Apply mean and standard deviation
      let opacity = mean + z0 * stdDev
      
      // Clamp to reasonable range (0.02 to 0.08)
      opacity = Math.max(0.02, Math.min(0.08, opacity))
      
      return opacity
    }

    const terms = [
      'MIDI', 'OSC', 'LFO', 'ADSR', 'VCA', 'VCF', 'VCO', 'FM', 'AM', 'PM',
      'WAV', 'SINE', 'SAW', 'SQR', 'TRI', 'NOISE', 'PWM', 'RING', 'SYNC',
      'FILTER', 'CUTOFF', 'RES', 'ENV', 'ATTACK', 'DECAY', 'SUSTAIN', 'RELEASE',
      'REVERB', 'DELAY', 'CHORUS', 'FLANGER', 'PHASER', 'DISTORT', 'BITCRUSH',
      'COMP', 'LIMIT', 'GATE', 'EXP', 'SIDE', 'CHAIN', 'BUS', 'AUX', 'SEND',
      'RETURN', 'INSERT', 'PRE', 'POST', 'GAIN', 'PAN', 'WIDTH', 'MONO', 'STEREO',
      'BPM', 'TEMPO', 'SYNC', 'CLOCK', 'QUANT', 'GRID', 'SWING', 'GROOVE',
      'KICK', 'SNARE', 'HIHAT', 'CLAP', 'TOM', 'RIDE', 'CRASH', 'PERC',
      '808', '909', '707', '606', 'TR', 'CR', 'JUNO', 'MOOG', 'PROPHET',
      'DX7', 'TB303', 'SH101', 'MS20', 'ARP', 'NORD', 'VIRUS', 'SERUM',
      'WAVETABLE', 'GRANULAR', 'ADDITIVE', 'SUBTRACTIVE', 'MODAL', 'PHYSICAL',
      'SAMPLE', 'LOOP', 'SLICE', 'CHOP', 'PITCH', 'TIME', 'STRETCH', 'WARP',
      'FFT', 'STFT', 'VOCODER', 'FORMANT', 'HARMONIZER', 'AUTOTUNE', 'MELODYNE',
      'SIDECHAIN', 'PUMP', 'DUCK', 'MULTIBAND', 'PARALLEL', 'SERIAL', 'M/S',
      'EQ', 'HPF', 'LPF', 'BPF', 'NOTCH', 'SHELF', 'BELL', 'PARAMETRIC',
      'DB', 'HZ', 'MS', 'Q', 'FREQ', 'AMP', 'PHASE', 'MOD', 'DEPTH', 'RATE',
      'DRY', 'WET', 'MIX', 'BLEND', 'CROSSFADE', 'MORPH', 'INTERPOLATE',
      'BUFFER', 'STREAM', 'RENDER', 'PROCESS', 'COMPUTE', 'THREAD', 'CORE',
      'NEURAL', 'AI', 'ML', 'DSP', 'FFT', 'ALGO', 'KERNEL', 'MATRIX', 'VECTOR',
      'QUANTUM', 'BINARY', 'HEX', 'BIT', 'BYTE', 'FLOAT', 'INT', 'BOOL',
      'FUNC', 'CALL', 'EXEC', 'RUN', 'INIT', 'LOAD', 'SAVE', 'DUMP', 'FLUSH',
      'ALLOC', 'FREE', 'MALLOC', 'NULL', 'VOID', 'TRUE', 'FALSE', 'ERROR',
      'DEBUG', 'LOG', 'TRACE', 'WARN', 'INFO', 'FATAL', 'PANIC', 'ASSERT',
      'PUSH', 'POP', 'PULL', 'FETCH', 'STORE', 'GET', 'SET', 'PUT', 'PATCH',
      'OVERRIDE', 'EXTEND', 'INHERIT', 'ABSTRACT', 'STATIC', 'VIRTUAL', 'CONST',
    ]
    
    const operators = ['>', '<', '=', '+', '-', '*', '/', '%', '&', '|', '^', '~', '!', '?', ':', ';', ',', '.']
    const brackets = ['[', ']', '(', ')', '{', '}', '<', '>']
    const prefixes = ['@', '#', '$', '&', '*', '~', '!', '^', '>>>', '<<<', '//', '::']
    
    const generateChaos = () => {
      const chaos: string[] = []
      const segments = 30 + Math.floor(Math.random() * 40) // 30-70 segments
      
      for (let i = 0; i < segments; i++) {
        const roll = Math.random()
        
        if (roll < 0.15) {
          // Pure hex madness
          const hexLen = 2 + Math.floor(Math.random() * 6)
          chaos.push(`0x${Array.from({length: hexLen}, () => 
            Math.floor(Math.random() * 16).toString(16).toUpperCase()
          ).join('')}`)
        } else if (roll < 0.25) {
          // Binary chunks
          const binLen = 4 + Math.floor(Math.random() * 8)
          chaos.push(`0b${Array.from({length: binLen}, () => 
            Math.random() > 0.5 ? '1' : '0'
          ).join('')}`)
        } else if (roll < 0.35) {
          // Operator spam
          const opCount = 2 + Math.floor(Math.random() * 4)
          chaos.push(Array.from({length: opCount}, () => 
            operators[Math.floor(Math.random() * operators.length)]
          ).join(''))
        } else if (roll < 0.45) {
          // Bracket chaos
          const bracket1 = brackets[Math.floor(Math.random() * brackets.length)]
          const bracket2 = brackets[Math.floor(Math.random() * brackets.length)]
          const term = terms[Math.floor(Math.random() * terms.length)]
          chaos.push(`${bracket1}${term}${bracket2}`)
        } else if (roll < 0.55) {
          // Function calls
          const term = terms[Math.floor(Math.random() * terms.length)]
          const args = Math.floor(Math.random() * 4)
          const argList = Array.from({length: args}, () => 
            (Math.random() * 1000).toFixed(Math.random() > 0.5 ? 0 : 2)
          ).join(',')
          chaos.push(`${term}(${argList})`)
        } else if (roll < 0.65) {
          // Prefixed terms
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
          const term = terms[Math.floor(Math.random() * terms.length)]
          chaos.push(`${prefix}${term}`)
        } else if (roll < 0.75) {
          // Value assignments
          const term = terms[Math.floor(Math.random() * terms.length)]
          const op = ['=', '+=', '-=', '*=', '/=', '|=', '&='][Math.floor(Math.random() * 7)]
          const val = Math.floor(Math.random() * 9999)
          chaos.push(`${term}${op}${val}`)
        } else if (roll < 0.85) {
          // Float madness
          const term = terms[Math.floor(Math.random() * terms.length)]
          const float = (Math.random() * 9999).toFixed(Math.floor(Math.random() * 5))
          const unit = ['Hz', 'dB', 'ms', '%', 'st', 'ct'][Math.floor(Math.random() * 6)]
          chaos.push(`${term}:${float}${unit}`)
        } else {
          // Pure term with operator suffix
          const term = terms[Math.floor(Math.random() * terms.length)]
          const suffix = ['++', '--', '<<', '>>', '!', '?', '...', '::'][Math.floor(Math.random() * 8)]
          chaos.push(`${term}${suffix}`)
        }
      }
      
      return chaos.join(' ')
    }

    // Initialize with lines at fixed vertical positions (no vertical movement)
    const initialLines: CodeLine[] = []
    const lineSpacing = 30 // Fixed spacing in pixels between lines
    const numLines = Math.ceil(viewportHeight / lineSpacing) + 5 // Dynamic based on height, +5 for buffer
    
    for (let i = 0; i < numLines; i++) {
      const speedRoll = Math.random()
      let speed
      if (speedRoll < 0.4) {
        speed = 8 + Math.random() * 10 // Fast: 8-18s
      } else if (speedRoll < 0.7) {
        speed = 18 + Math.random() * 17 // Medium: 18-35s
      } else {
        speed = 35 + Math.random() * 25 // Slow: 35-60s
      }
      
      initialLines.push({
        id: i, // Use index as ID for fixed positions
        content: generateChaos() + ' ' + generateChaos() + ' ' + generateChaos(),
        speed: speed,
        direction: Math.random() > 0.5 ? 'left' : 'right' as 'left' | 'right',
        opacity: generateRandomOpacity()
      })
    }
    setCodeLines(initialLines)
  }, [viewportHeight]) // Regenerate when viewport height changes

  // Separate effect for fade-in (only runs once on mount)
  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => {
      clearTimeout(fadeInTimer)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 5s ease-out', // Slower, more gradual fade-in starting early
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          fontFamily: activeFont.family,
          fontSize: '13px',
          fontWeight: '700',
          color: '#ffffff',
          letterSpacing: '0.05em',
          lineHeight: '1.5',
          overflow: 'hidden',
        }}
      >
        {codeLines.map((line) => {
          // Create unique oscillation timing for each line
          const oscillationDuration = 8 + (line.id % 5) * 2 // 8-16s variation
          const oscillationDelay = -(line.id % 10) * 0.8 // Stagger start times
          
          return (
            <div
              key={line.id}
              style={{
                position: 'absolute',
                top: `${line.id * 30}px`, // Fixed pixel spacing (30px apart)
                left: 0,
                width: '100%',
                height: '13px', // Consistent line height
                whiteSpace: 'nowrap',
                animation: [
                  line.direction === 'left' 
                    ? `scrollLeft ${line.speed}s linear infinite`
                    : `scrollRight ${line.speed}s linear infinite`,
                  `opacityOscillate ${oscillationDuration}s ease-in-out infinite`
                ].join(', '),
                animationDelay: `0s, ${oscillationDelay}s`,
                filter: 'blur(0.3px)', // Subtle motion blur
                textShadow: line.direction === 'left'
                  ? '1px 0 2px rgba(255, 255, 255, 0.1), 2px 0 3px rgba(255, 255, 255, 0.05)' // Horizontal blur left
                  : '-1px 0 2px rgba(255, 255, 255, 0.1), -2px 0 3px rgba(255, 255, 255, 0.05)', // Horizontal blur right
                // Set CSS custom property for oscillation range based on base opacity
                ['--base-opacity' as string]: line.opacity,
              }}
            >
              {line.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FallingCode
