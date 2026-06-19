import React from 'react'
import { ArrowUpRight } from 'lucide-react'

export default function Card({ title, description, image, actionText, actionLink, onClick, tags, icon: Icon }) {
  const CardWrapper = onClick ? 'button' : 'div'
  
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group text-left">
      {/* Card Image or Icon Header */}
      {image ? (
        <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-white/5">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
        </div>
      ) : Icon ? (
        <div className="p-6 pb-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6" />
          </div>
        </div>
      ) : null}

      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 text-gray-400 border border-white/5 text-[10px] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-display font-bold text-lg text-white group-hover:text-sky-300 transition-colors mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
            {description}
          </p>
        </div>

        {/* Action Button/Link */}
        {(actionText || onClick || actionLink) && (
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            {actionLink ? (
              <a
                href={actionLink}
                className="inline-flex items-center gap-1 text-sm font-semibold text-sky-400 hover:text-sky-300 group-hover:translate-x-0.5 transition-all"
              >
                <span>{actionText || 'Learn More'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : onClick ? (
              <button
                onClick={onClick}
                className="inline-flex items-center gap-1 text-sm font-semibold text-sky-400 hover:text-sky-300 group-hover:translate-x-0.5 transition-all text-left"
              >
                <span>{actionText || 'Action'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-sm font-semibold text-gray-400">
                {actionText}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
