import React from 'react';
import Svg, { G, Path, Rect } from 'react-native-svg';

export default function CTLogo({ width, height }: { width?: number; height?: number }) {
    // Default size if not provided
    const w = width || 56;
    const h = height || 56;

    return (
        <Svg
            width={w}
            height={h}
            viewBox="0 0 512 512"
            fill="none"
        >
            <G fill="#FFFFFF">
                {/* C */}
                <Path d="
          M256 96
          C185 96 128 153 128 224
          C128 295 185 352 256 352
          L320 352
          L320 320
          L256 320
          C203 320 160 277 160 224
          C160 171 203 128 256 128
          L320 128
          L320 96
          Z" />
                {/* T */}
                <Rect x="336" y="96" width="48" height="256" />
                {/* & */}
                <Path d="
          M256 208
          C240 208 228 220 228 236
          C228 252 240 264 256 264
          C272 264 284 252 284 236
          C284 220 272 208 256 208
          Z" />
            </G>
        </Svg>
    );
}
