import { SafeAreaView, ScrollView, View } from 'react-native';

interface PageLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
}

export const PageLayout = ({ children, scrollable = false, className = '' }: PageLayoutProps) => {
  const inner = scrollable ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName={`pb-8 ${className}`}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${className}`}>{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-dark-bg">
      {inner}
    </SafeAreaView>
  );
};
