(function () {
    if (!document.body.classList.contains('debug')) return;

    const attr = document.body.getAttribute('data-highlight-element-spaces');
    if (!attr) return;

    const selectors = attr.split(',').map(s => s.trim()).filter(Boolean);

    const BORDER_COLOR = '#FFBBEB';
    const PADDING_BG   = '#67FCFE';
    const MARGIN_BG    = '#FFBBEB';
    const FONT_COLOR   = '#ffffff';
    const FONT_SIZE    = '9px';
    const BOX_PADDING  = '4px';

    function makeBadge(value, bg) {
        const el = document.createElement('span');
        el.textContent = value + 'px';
        el.style.cssText = [
            'position:static',
            'display:inline-block',
            'font-size:' + FONT_SIZE,
            'padding:' + BOX_PADDING,
            'background:' + bg,
            'color:' + FONT_COLOR,
            'line-height:1',
            'white-space:nowrap',
            'font-family:monospace',
            'pointer-events:none',
            'user-select:none',
            'border-radius:2px',
        ].join(';');
        return el;
    }

    /**
     * sides: 'top' | 'bottom' | 'left' | 'right'
     * For top/bottom: badge group centered horizontally, positioned at the edge
     * For left/right: badge group centered vertically, positioned at the edge
     */
    function makeSideGroup(side, paddingVal, marginVal) {
        const wrapper = document.createElement('div');

        const isHorizontal = (side === 'left' || side === 'right');

        wrapper.style.cssText = [
            'position:absolute',
            'display:flex',
            'flex-direction:row',
            'gap:2px',
            'z-index:999999',
            'pointer-events:none',
            'user-select:none',
        ].join(';');

        if (side === 'top') {
            wrapper.style.top      = '0';
            wrapper.style.left     = '50%';
            wrapper.style.transform = 'translate(-50%, -50%)';
        } else if (side === 'bottom') {
            wrapper.style.bottom   = '0';
            wrapper.style.left     = '50%';
            wrapper.style.transform = 'translate(-50%, 50%)';
        } else if (side === 'left') {
            wrapper.style.left     = '0';
            wrapper.style.top      = '50%';
            wrapper.style.transform = 'translate(-50%, -50%)';
        } else if (side === 'right') {
            wrapper.style.right    = '0';
            wrapper.style.top      = '50%';
            wrapper.style.transform = 'translate(50%, -50%)';
        }

        const paddingBadge = makeBadge(paddingVal, PADDING_BG);
        wrapper.appendChild(paddingBadge);

        if (marginVal > 0) {
            const marginBadge = makeBadge(marginVal, MARGIN_BG);
            wrapper.appendChild(marginBadge);
        }

        return wrapper;
    }

    selectors.forEach(function (selector) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(function (el) {
            const computed = window.getComputedStyle(el);

            const pt = Math.round(parseFloat(computed.paddingTop));
            const pb = Math.round(parseFloat(computed.paddingBottom));
            const pl = Math.round(parseFloat(computed.paddingLeft));
            const pr = Math.round(parseFloat(computed.paddingRight));

            const mt = Math.round(parseFloat(computed.marginTop));
            const mb = Math.round(parseFloat(computed.marginBottom));
            const ml = Math.round(parseFloat(computed.marginLeft));
            const mr = Math.round(parseFloat(computed.marginRight));

            // Ensure absolute positioning context without disrupting layout
            const existingPosition = computed.position;
            if (existingPosition === 'static') {
                el.style.position = 'relative';
            }

            el.style.outline = '1px solid ' + BORDER_COLOR;

            el.appendChild(makeSideGroup('top',    pt, mt));
            el.appendChild(makeSideGroup('bottom', pb, mb));
            el.appendChild(makeSideGroup('left',   pl, ml));
            el.appendChild(makeSideGroup('right',  pr, mr));
        });
    });
})();
