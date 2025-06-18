'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  Calendar,
  Tag,
  TrendingUp,
  Github,
  Star,
  Grid3X3,
  List,
  LayoutGrid,
  Filter,
  SortAsc,
  ChevronDown,
} from 'lucide-react';
import Fuse from 'fuse.js';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import {
  parseMarkdownToResources,
  getCategoryStats,
  getDateStats,
  type Resource,
} from '@/data/parser';

type ViewMode = 'grid' | 'list' | 'compact';
type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'category';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // 加载README.md数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/README.md');
        const markdownContent = await response.text();
        const parsedResources = parseMarkdownToResources(markdownContent);
        setResources(parsedResources);
      } catch (error) {
        console.error('Failed to load README.md:', error);
        // 如果加载失败，使用示例数据
        const sampleData = parseMarkdownToResources(`## Libs and Components`);
        setResources(sampleData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 创建搜索引擎
  const fuse = useMemo(() => {
    return new Fuse(resources, {
      keys: ['name', 'description', 'category'],
      threshold: 0.3,
    });
  }, [resources]);

  // 过滤和搜索（不包括分页）
  const filteredResources = useMemo(() => {
    let filtered = resources;

    // 分类筛选
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((resource) => selectedCategories.includes(resource.category));
    }

    // 搜索
    if (searchTerm) {
      const searchResults = fuse.search(searchTerm);
      filtered = searchResults.map((result) => result.item);

      // 如果有分类筛选，再次过滤搜索结果
      if (selectedCategories.length > 0) {
        filtered = filtered.filter((resource) => selectedCategories.includes(resource.category));
      }
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-desc':
          return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
        case 'date-asc':
          return new Date(a.date || '').getTime() - new Date(b.date || '').getTime();
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [resources, searchTerm, selectedCategories, sortBy, fuse]);

  // 分页数据
  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredResources.slice(startIndex, endIndex);
  }, [filteredResources, currentPage, itemsPerPage]);

  // 分页信息
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredResources.length);

  // 重置页码当筛选条件变化时
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, sortBy, itemsPerPage]);

  // 统计数据
  const categoryStats = useMemo(() => getCategoryStats(resources), [resources]);
  const categories = Object.keys(categoryStats);

  // 处理分类选择
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // 清除所有分类筛选
  const clearCategoryFilters = () => {
    setSelectedCategories([]);
  };

  // 渲染资源卡片 - 网格视图
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {paginatedResources.map((resource, index) => (
        <Card
          key={index}
          className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1 bg-white border-gray-100 hover:border-blue-300 h-[320px] flex flex-col relative overflow-hidden transform hover:scale-105"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'fadeInUp 0.6s ease-out forwards',
          }}
        >
          {/* 背景渐变效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-500"></div>

          {/* 光泽效果 */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:via-purple-600/20 group-hover:to-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>

          <CardHeader className="pb-3 flex-shrink-0 relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-all duration-300 font-semibold line-clamp-2 min-h-[3.5rem] group-hover:scale-105 transform">
                  {resource.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-all duration-300 hover:scale-110 transform"
                  >
                    {resource.category}
                  </Badge>
                  {resource.date && (
                    <Badge
                      variant="outline"
                      className="text-xs text-gray-500 border-gray-300 group-hover:border-blue-300 group-hover:text-blue-600 transition-all duration-300 hover:scale-110 transform"
                    >
                      {resource.date}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 flex flex-col flex-1 justify-between relative z-10">
            <CardDescription className="text-sm leading-relaxed text-gray-600 line-clamp-4 min-h-[5.25rem] mb-4 group-hover:text-gray-700 transition-colors duration-300">
              {resource.description}
            </CardDescription>

            <Button
              asChild
              size="sm"
              className="w-full bg-black hover:bg-blue-600 text-white transition-all duration-300 hover:shadow-lg hover:scale-105 transform active:scale-95 group-hover:animate-pulse"
            >
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Visit Project
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // 渲染资源卡片 - 列表视图
  const renderListView = () => (
    <div className="space-y-4">
      {paginatedResources.map((resource, index) => (
        <Card
          key={index}
          className="group hover:shadow-xl transition-all duration-400 hover:border-blue-300 bg-white h-[130px] relative overflow-hidden hover:scale-102 transform"
          style={{
            animationDelay: `${index * 50}ms`,
            animation: 'slideInLeft 0.5s ease-out forwards',
          }}
        >
          {/* 左侧装饰条 */}
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top"></div>

          {/* 背景效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-transparent group-hover:from-blue-50/30 transition-all duration-400"></div>

          <CardContent className="p-6 h-full flex items-center relative z-10">
            <div className="flex items-center justify-between gap-6 w-full">
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-all duration-300 line-clamp-1 hover:scale-105 transform">
                    {resource.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700 shrink-0 group-hover:bg-blue-100 group-hover:text-blue-700 transition-all duration-300 hover:scale-110 transform"
                  >
                    {resource.category}
                  </Badge>
                  {resource.date && (
                    <Badge
                      variant="outline"
                      className="text-xs text-gray-500 shrink-0 group-hover:border-blue-300 group-hover:text-blue-600 transition-all duration-300 hover:scale-110 transform"
                    >
                      {resource.date}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] group-hover:text-gray-700 transition-colors duration-300">
                  {resource.description}
                </p>
              </div>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="shrink-0 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-110 transform active:scale-95 hover:shadow-lg"
              >
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Visit
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // 渲染资源卡片 - 紧凑视图
  const renderCompactView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {paginatedResources.map((resource, index) => (
        <Card
          key={index}
          className="group hover:shadow-xl transition-all duration-400 hover:border-blue-300 bg-white h-[260px] flex flex-col relative overflow-hidden hover:scale-105 transform hover:-translate-y-2"
          style={{
            animationDelay: `${index * 80}ms`,
            animation: 'zoomIn 0.5s ease-out forwards',
          }}
        >
          {/* 顶部装饰条 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

          {/* 背景效果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/20 group-hover:via-purple-50/20 group-hover:to-pink-50/20 transition-all duration-500"></div>

          <CardContent className="p-4 flex flex-col h-full justify-between relative z-10">
            <div className="space-y-3 flex flex-col flex-1">
              <div className="flex-shrink-0">
                <h3 className="font-medium group-hover:text-blue-600 transition-all duration-300 text-sm leading-tight line-clamp-2 min-h-[2.5rem] hover:scale-105 transform">
                  {resource.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-all duration-300 hover:scale-110 transform hover:rotate-2"
                  >
                    {resource.category}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-4 flex-1 min-h-[4rem] group-hover:text-gray-700 transition-colors duration-300">
                {resource.description}
              </p>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="w-full text-xs h-8 mt-3 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-105 transform active:scale-95 hover:shadow-md"
            >
              <a href={resource.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3 h-3 mr-1 group-hover:animate-spin" />
                Visit
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const getSortLabel = (value: SortOption) => {
    switch (value) {
      case 'date-desc':
        return 'Date (Newest first)';
      case 'date-asc':
        return 'Date (Oldest first)';
      case 'name-asc':
        return 'Name (A-Z)';
      case 'name-desc':
        return 'Name (Z-A)';
      case 'category':
        return 'Category';
      default:
        return 'Date (Newest first)';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading awesome resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <img
                width="35"
                src="https://preview.blendviewer.com/images/logo.svg"
                alt="logo of awesome-blendviewer repository"
              />

              <div>
                <h1 className="text-xl font-semibold text-gray-900">玲珑岛</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{resources.length} resources</span>
              <a
                href="https://github.com/blendviewer/awesome-blendviewer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex justify-center mb-6">
            {' '}
            <img
              width="95"
              src="https://preview.blendviewer.com/images/logo.svg"
              alt="logo of awesome-blendviewer repository"
            />
            <div className="relative"></div>
          </div>
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">awesome-blendviewer</h1>
          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-2">
            Open Dataset{' '}
            <a
              href="https://www.blendviewer.com/?category=SPACE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-700 underline"
            >
              玲珑岛
            </a>
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和控制栏 */}
        <div className="mb-6 space-y-4">
          {/* 控制栏 */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* 搜索框 */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 text-sm bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500"
              />
            </div>

            {/* 分类筛选 Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 px-3 justify-between min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">
                      {selectedCategories.length === 0
                        ? 'Filter'
                        : `${selectedCategories.length} selected`}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Categories</h4>
                    {selectedCategories.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearCategoryFilters}
                        className="h-auto p-0 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <label
                          htmlFor={category}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {category}{' '}
                          <span className="text-gray-500">({categoryStats[category]})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* 排序 */}
            {/* <div className="sm:w-48">
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="h-10 bg-white border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest first)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest first)</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* 视图模式切换 - 移到最右边 */}
            <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden ml-auto">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-10 w-10 p-0 rounded-none border-0 bg-white hover:bg-gray-50 text-gray-700"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                {viewMode === 'grid' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-10 w-10 p-0 rounded-none border-0 bg-white hover:bg-gray-50 text-gray-700"
                >
                  <List className="w-4 h-4" />
                </Button>
                {viewMode === 'list' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('compact')}
                  className="h-10 w-10 p-0 rounded-none border-0 bg-white hover:bg-gray-50 text-gray-700"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                {viewMode === 'compact' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 资源展示 */}
        <div className="space-y-6">
          {filteredResources.length === 0 ? (
            <Card className="text-center py-12 bg-white">
              <CardContent>
                <div className="text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No resources found</h3>
                  <p>Try adjusting your search terms or filters</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {viewMode === 'grid' && renderGridView()}
              {viewMode === 'list' && renderListView()}
              {viewMode === 'compact' && renderCompactView()}
            </>
          )}
        </div>

        {/* 结果统计和分页控制 */}
        {filteredResources.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t pt-6">
            <div className="text-sm text-gray-600">
              {`${startItem}-${endItem} of ${filteredResources.length} resources`}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number(value))}
                  >
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">First page</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Previous page</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Next page</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Last page</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Created By{' '}
              <a
                href="https://www.blendviewer.com/"
                className="text-black hover:underline font-medium"
              >
                www.blendviewer.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
