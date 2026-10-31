import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatToTenth, formatToTenthSigned } from '@/components/utils/numberFormat';

export default function GuidanceModal({
  open,
  stepId,
  onContinue,
  onCloseForever,
  data = {}
}) {
  if (!open || !stepId) return null;

  const getBodyContent = (id) => {
    switch (id) {
      case 'G0_WELCOME':
        return (
          <>
            <p>You're about to start your first playthrough. This isn't a game with one "correct" path — it's about trade-offs.</p>
            <p>Over time, your choices shape your child's strengths, struggles, and future opportunities.</p>
            <p className="mt-4 font-medium">What I'll do:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Explain Focus and Stress (your resources each year)</li>
              <li>Explain how choices affect your child</li>
              <li>Then I can check in once per year with quick "what changed & why" notes</li>
            </ul>
          </>
        );
      case 'G1_PARENTING_STYLE_PRE':
        return (
          <>
            <p>Think of this as your default approach, not a permanent label. You can always make different choices later.</p>
            <p className="mt-4 font-medium">This choice affects:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your starting Focus and Stress</li>
              <li>How some situations are interpreted</li>
              <li>The kind of trade-offs you'll feel early on</li>
            </ul>
          </>
        );
      case 'G2_PARENTING_STYLE_POST':
        return (
          <>
            <p>Good choice. This sets your starting point — but your actions over the years matter more than this label.</p>
            {data.focusDelta !== undefined && data.stressDelta !== undefined ? (
              <>
                <p className="mt-4 font-medium">What it changes right now:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Focus: {data.focusDelta}</li>
                  <li>Stress: {data.stressDelta}</li>
                </ul>
              </>
            ) : (
              <p className="mt-4">Your starting Focus and Stress will shift slightly based on this choice.</p>
            )}
            <p className="mt-4 font-medium">How to think about it:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Focus is what you can "spend" on actions this year</li>
              <li>Stress is pressure that can make everything harder</li>
              <li>You can steer your style over time through your decisions</li>
            </ul>
          </>
        );
      case 'G3_FINANCES_PRE':
        return (
          <>
            <p>Your home and car set your baseline budget.</p>
            <p className="mt-4 font-medium">In general:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Higher costs can add comfort or options… but often increase Stress</li>
              <li>Lower costs can reduce Stress… but may limit some opportunities</li>
              <li>There's no "best" choice — it depends on how you want to play</li>
            </ul>
          </>
        );
      case 'G4_FINANCES_POST':
        return (
          <>
            <p>Here's what your starting situation means for the game:</p>
            {data.baselineStress && data.flexibility && data.resources ? (
              <ul className="list-disc list-inside space-y-1 ml-2 mt-4">
                <li>Baseline Stress: {data.baselineStress}</li>
                <li>Flexibility (Focus): {data.flexibility}</li>
                <li>Resources: {data.resources}</li>
              </ul>
            ) : (
              <p className="mt-4">Your budget affects your Stress and the options you can comfortably afford.</p>
            )}
            <p className="mt-4">Reminder: You can still make great outcomes with any start — it just changes the trade-offs you'll manage.</p>
          </>
        );
      case 'G5_CORE_LOOP':
        return (
          <>
            <p>Each year, you'll do three things:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-3">
              <li>Spend Focus on actions (skills, money, relationships, health)</li>
              <li>Respond to 1 required Moment (a parenting situation)</li>
              <li>Age Up to move to the next year</li>
            </ul>
            <p className="mt-4 font-medium">Focus = your time/energy each year</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Most actions cost Focus</li>
              <li>High Stress shrinks your Focus capacity</li>
            </ul>
            <p className="mt-4 font-medium">Stress = pressure on you/your household</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Some choices raise it, others reduce it</li>
              <li>High Stress limits what you can get done</li>
            </ul>
            <p className="mt-4 font-medium">The key idea:</p>
            <p>Your choices don't just change numbers—they create patterns that shape your child over time.</p>
          </>
        );
      case 'G5A_UI_MAP':
        return (
          <>
            <p className="font-medium mb-3">Where everything is:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong>⚡ Actions:</strong> spend Focus to do things (skills, money, health, relationships)</li>
              <li><strong>🏠 Home:</strong> your Life Goals & Milestones, yearly recap, Life Log</li>
              <li><strong>👥 Relationships:</strong> people + pets; tap someone to see bond, history, and options</li>
              <li><strong>🎂 Age Up:</strong> move to the next year (after you complete the required Moment)</li>
            </ul>
            <p className="mt-4 text-sm text-slate-600">
              <strong>Tip:</strong> Tap your avatar for Profile tools (collections, finances, traits). Tap the stats strip to see details.
            </p>
          </>
        );
      case 'G5B_ACTIONS_TAB':
        return (
          <>
            <p className="mb-3">Actions cost Focus. Some also cost money or affect Stress—tap an action to preview results.</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Use <strong>Life Hub</strong> when you're not sure what to do next</li>
              <li>Greyed-out actions tell you what you're missing (requirements)</li>
              <li>Try spending Focus until you hit a required Moment, then Age Up</li>
            </ul>
          </>
        );
      case 'G5C_PROFILE_TOOLS':
        return (
          <>
            <p className="mb-3">Your Profile is where you manage long-term systems and what you've unlocked.</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2 text-sm">
              <li><strong>Income & Expenses:</strong> track cashflow</li>
              <li><strong>Family Patterns & Scars:</strong> long-term traits that shape choices</li>
              <li><strong>Passport / Inventory / Collections:</strong> your unlocks</li>
              <li><strong>Bookshelf modules:</strong> upgrades that change options</li>
              <li><strong>Trophy Case:</strong> achievements</li>
              <li><strong>Challenges & 💎 Diamonds:</strong> optional extras (never required to enjoy the game)</li>
            </ul>
          </>
        );
      case 'G5D_RELATIONSHIPS_TAB':
        return (
          <>
            <p className="mb-3">Tap a person (or pet) to see bond, history, and what you can do together.</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Strong bonds unlock Moments and opportunities</li>
              <li>Some choices raise Stress—relationships can help you recover over time</li>
              <li>Check in here every year to keep connections healthy</li>
            </ul>
          </>
        );
      case 'G6_NO_SINGLE_RIGHT_WAY':
        return (
          <>
            <p>You're not trying to "solve" parenting — you're exploring outcomes.</p>
            <p className="mt-4">Over time, your child might grow into someone who thrives under pressure, takes big risks, leads others, creates art, invents things…</p>
            <p className="mt-2">…or they might struggle with consistency and adulthood. It depends on the patterns you build year after year.</p>
            <p className="mt-4 font-medium">Your job is to experiment, learn, and see how different choices shape them.</p>
          </>
        );
      case 'G7_YEARLY_CHECKINS_CHOICE':
        return (
          <>
            <p>At the end of every year, I can pop up with:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-3">
              <li>What changed (Focus, Stress, and your child's growth)</li>
              <li>Why it changed</li>
              <li>One quick tip for next year</li>
            </ul>
            <p className="mt-4">You can turn this off anytime.</p>
          </>
        );
      case 'Y1_YEARLY_CHECKIN':
        return (
          <>
            <p className="font-medium mb-3">Here's what changed this year — and why.</p>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium text-sm mb-2">Your resources</p>
                <div className="space-y-2 ml-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">Focus:</span>
                      <span>{formatToTenth(data.focusStart || 0)} → {formatToTenth(data.focusEnd || 0)}</span>
                      <span className={`text-sm ${(data.focusDelta || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({formatToTenthSigned(data.focusDelta || 0)})
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Why: {data.focusReason || 'Focus tends to drop when Stress is high or when you choose many high-effort actions.'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">Stress:</span>
                      <span>{formatToTenth(data.stressStart || 0)} → {formatToTenth(data.stressEnd || 0)}</span>
                      <span className={`text-sm ${(data.stressDelta || 0) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ({formatToTenthSigned(data.stressDelta || 0)})
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Why: {data.stressReason || 'Stress increases with financial pressure and difficult events, and decreases with support and recovery actions.'}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium text-sm mb-2">Your child</p>
                {data.childTraitChanges && Array.isArray(data.childTraitChanges) && data.childTraitChanges.length > 0 ? (
                  <div className="space-y-2 ml-2">
                    {data.childTraitChanges.slice(0, 3).map((change, idx) => (
                      <div key={idx}>
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium">{change.trait}:</span>
                          <span className={`text-sm ${change.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatToTenthSigned(change.delta)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">{change.reason}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 ml-2">
                    Your child's growth reflects the choices you prioritized this year.
                  </div>
                )}
              </div>

              <div>
                <p className="font-medium text-sm mb-2">One tip for next year</p>
                <div className="text-sm text-slate-700 ml-2">
                  {data.tip || (data.stressEnd >= 70 
                    ? 'Stress is rising — consider a recovery action next year to protect Focus.'
                    : 'Keep experimenting — small choices compound over time.')}
                </div>
              </div>
            </div>
          </>
        );
      default:
        return <p>Guidance content loading...</p>;
    }
  };

  const GUIDANCE_CONTENT = {
    G0_WELCOME: {
      title: 'Welcome to Raising Tomorrow',
      primaryButton: "Let's begin"
    },
    G1_PARENTING_STYLE_PRE: {
      title: 'Choose a starting parenting style',
      primaryButton: 'Got it'
    },
    G2_PARENTING_STYLE_POST: {
      title: `Style selected: ${data.styleName || 'Your Choice'}`,
      primaryButton: 'Continue'
    },
    G3_FINANCES_PRE: {
      title: 'Pick your starting finances',
      primaryButton: 'Got it'
    },
    G4_FINANCES_POST: {
      title: 'Budget impact',
      primaryButton: 'Continue'
    },
    G5_CORE_LOOP: {
      title: 'How the game works each year',
      primaryButton: "OK, I'm ready"
    },
    G5A_UI_MAP: {
      title: 'Where everything is',
      primaryButton: 'Got it'
    },
    G5B_ACTIONS_TAB: {
      title: 'Actions 101',
      primaryButton: 'OK'
    },
    G5C_PROFILE_TOOLS: {
      title: 'Profile = your toolbox',
      primaryButton: 'OK'
    },
    G5D_RELATIONSHIPS_TAB: {
      title: 'Relationships (and pets) are long-game',
      primaryButton: 'Got it'
    },
    G6_NO_SINGLE_RIGHT_WAY: {
      title: "There's no one \"correct\" way to raise your child",
      primaryButton: 'Got it'
    },
    G7_YEARLY_CHECKINS_CHOICE: {
      title: 'Want a quick check-in each year?',
      primaryButton: 'See you next year',
      secondaryButton: "Close forever — I don't need help",
      secondaryDestructive: true
    },
    Y1_YEARLY_CHECKIN: {
      title: `Year ${data.year || 0} Check-in`,
      primaryButton: 'Got it',
      secondaryButton: 'Close forever',
      secondaryDestructive: true
    }
  };

  const content = GUIDANCE_CONTENT[stepId];
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.title}</h2>
          <div className="text-sm text-slate-700 leading-relaxed space-y-3">
            {getBodyContent(stepId)}
          </div>
          
          <div className="flex flex-col gap-2 pt-4">
            <Button
              onClick={onContinue}
              className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700"
            >
              {content.primaryButton}
            </Button>
            
            {content.secondaryButton && (
              <Button
                onClick={onCloseForever}
                variant={content.secondaryDestructive ? 'destructive' : 'outline'}
                className="w-full h-10 text-sm"
              >
                {content.secondaryButton}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}