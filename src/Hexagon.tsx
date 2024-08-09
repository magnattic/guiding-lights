import { ComponentProps, JSX, splitProps } from 'solid-js';

export const Hexagon = (
  props: ComponentProps<'div'> & {
    children?: JSX.Element;
    svgProps?: JSX.SvgSVGAttributes<SVGSVGElement>;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    pathClassList?: Record<string, boolean | undefined>;
  }
) => {
  const [localProps, otherProps] = splitProps(props, [
    'children',
    'svgProps',
    'pathClassList',
    'onMouseEnter',
    'onMouseLeave',
    'onClick',
    'class',
  ]);
  return (
    <div
      class={`flex justify-center items-center ${localProps.class}`}
      {...otherProps}
    >
      <svg
        {...localProps.svgProps}
        height="84"
        width="84"
        viewBox="0 0 84 84"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.0992 77L2.19922 42.5L22.0992 8H61.8992L81.7992 42.5L61.8992 77H22.0992Z"
          classList={localProps.pathClassList}
          onMouseEnter={localProps.onMouseEnter}
          onMouseLeave={localProps.onMouseLeave}
          onClick={localProps.onClick}
        ></path>
      </svg>
      <div
        class="absolute flex flex-col justify-center items-center"
        onMouseEnter={localProps.onMouseEnter}
        onMouseLeave={localProps.onMouseLeave}
        onClick={localProps.onClick}
      >
        {localProps.children}
      </div>
    </div>
  );
};
