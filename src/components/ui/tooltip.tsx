import * as React from 'react';
import * as TooltipPrimitives from "@radix-ui/react-tooltip";

// const testType: React.ForwardRefExoticComponent<TooltipProps & React.RefAttributes<HTMLDivElement>>;

interface TooltipProps extends TooltipPrimitives.TooltipProps {
	content: string,
}

const Tooltip: React.FC<TooltipProps> = (({ children, ...props }) => {
	const { content, ...otherProps } = props;

	return (
		<TooltipPrimitives.Provider>
			<TooltipPrimitives.Root
				{...otherProps}
			>
				<TooltipPrimitives.Trigger asChild>
					{children}
				</TooltipPrimitives.Trigger>
				<TooltipPrimitives.Content 
					side="top" 
					align="center"
					className="tooltip-content"
					{...props} 
				>
					{content}
					<TooltipPrimitives.Arrow width={11} height={5} className="tooltip-arrow" />
				</TooltipPrimitives.Content>
			</TooltipPrimitives.Root>
		</TooltipPrimitives.Provider>
	);
});
Tooltip.displayName = TooltipPrimitives.Root.displayName;

export { Tooltip };
