import React from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

/**
 * CategoryAccordionHeader
 * Accessible, robust accordion header for menu/service categories.
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - Category icon
 * @param {string} props.title - Category name
 * @param {string} props.description - Category description
 * @param {boolean} props.expanded - Is category expanded?
 * @param {function} props.onToggle - Click/keyboard handler
 * @param {string} props.id - Unique id for button
 * @param {string} props.ariaControls - Id of the controlled panel
 */
function CategoryAccordionHeader({
  icon,
  title,
  description,
  expanded,
  onToggle,
  id,
  ariaControls,
}) {
  return (
    <button
      type="button"
      id={id}
      aria-controls={ariaControls}
      aria-expanded={expanded}
      className="flex items-center w-full p-6 focus-visible:ring outline-none bg-transparent border-none text-left"
      onClick={onToggle}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(e);
        }
      }}
    >
      <span className="flex items-center gap-4 flex-1 min-w-0">
        <span
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(228, 179, 64, 0.15)', color: 'var(--color-icon)' }}
        >
          {icon}
        </span>
        <span className="text-left min-w-0">
          <span className="block text-2xl text-heading truncate" style={{ color: 'var(--color-heading)' }}>{title}</span>
          <span className="block text-sm font-inter truncate" style={{ color: 'var(--color-text-muted)' }}>{description}</span>
        </span>
      </span>
      <span className="w-8 flex items-center justify-center flex-shrink-0 ml-2" aria-hidden="true">
        <ChevronDown
          size={24}
          className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          style={{ color: 'var(--color-accent)' }}
        />
      </span>
    </button>
  );
}

CategoryAccordionHeader.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  expanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  ariaControls: PropTypes.string.isRequired,
};

export default CategoryAccordionHeader;
