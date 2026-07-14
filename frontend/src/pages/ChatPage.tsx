import { AnimatePresence, motion } from 'framer-motion'
import type { ChatAction } from '../types/chat'
import { BrandRail } from '../components/BrandRail'
import { ChatHeader } from '../components/ChatHeader'
import { ChatWorkspace } from '../components/ChatWorkspace'
import { Starfield } from '../components/Starfield'
import { SupportRail } from '../components/SupportRail'
import { useChatSession } from '../hooks/useChatSession'

export function ChatPage() {
  const { entries, isTyping, error, submitMessage, chooseAction, restart } = useChatSession()

  const chooseByValue = (value: string) => {
    void chooseAction({ label: value, value, variant: 'secondary' })
  }

  const choose = (action: ChatAction) => {
    void chooseAction(action)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04101a] text-slate-100">
      <Starfield />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.985, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative z-10 mx-auto flex h-[100dvh] w-full overflow-hidden border-white/10 bg-[#07141f]/78 shadow-panel backdrop-blur-xl sm:h-[calc(100dvh-24px)] sm:max-w-[1540px] sm:rounded-[28px] sm:border sm:my-3"
        >
          <BrandRail />
          <section className="flex min-w-0 flex-1 flex-col">
            <ChatHeader onMenu={() => chooseByValue('main_menu')} onRestart={() => void restart()} />
            <div className="flex min-h-0 flex-1">
              <ChatWorkspace entries={entries} isTyping={isTyping} error={error} onSubmit={(message) => void submitMessage(message)} onAction={choose} />
              <SupportRail onAction={chooseByValue} />
            </div>
          </section>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
