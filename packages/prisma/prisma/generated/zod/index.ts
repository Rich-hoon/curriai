import { z } from 'zod';
import { Prisma } from '../../../generated/prisma';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','clerkId','email','username','createdAt','updatedAt']);

export const CurriculumScalarFieldEnumSchema = z.enum(['id','title','description','domain','content','isPublic','forkCount','creatorId','forkedFromId','createdAt','updatedAt']);

export const UserProgressScalarFieldEnumSchema = z.enum(['userId','curriculumId','completedSteps','progress','updatedAt']);

export const ReviewScalarFieldEnumSchema = z.enum(['id','rating','comment','userId','curriculumId','createdAt','updatedAt']);

export const RateLimitScalarFieldEnumSchema = z.enum(['id','userId','date','count','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// CURRICULUM SCHEMA
/////////////////////////////////////////

export const CurriculumSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string().nullable(),
  domain: z.string(),
  content: JsonValueSchema,
  isPublic: z.boolean(),
  forkCount: z.number().int(),
  creatorId: z.string(),
  forkedFromId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Curriculum = z.infer<typeof CurriculumSchema>

/////////////////////////////////////////
// USER PROGRESS SCHEMA
/////////////////////////////////////////

export const UserProgressSchema = z.object({
  userId: z.string(),
  curriculumId: z.string(),
  completedSteps: JsonValueSchema,
  progress: z.number().int(),
  updatedAt: z.coerce.date(),
})

export type UserProgress = z.infer<typeof UserProgressSchema>

/////////////////////////////////////////
// REVIEW SCHEMA
/////////////////////////////////////////

export const ReviewSchema = z.object({
  id: z.string().cuid(),
  rating: z.number().int(),
  comment: z.string().nullable(),
  userId: z.string(),
  curriculumId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Review = z.infer<typeof ReviewSchema>

/////////////////////////////////////////
// RATE LIMIT SCHEMA
/////////////////////////////////////////

export const RateLimitSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  date: z.string(),
  count: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type RateLimit = z.infer<typeof RateLimitSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  curriculums: z.union([z.boolean(),z.lazy(() => CurriculumFindManyArgsSchema)]).optional(),
  userProgress: z.union([z.boolean(),z.lazy(() => UserProgressFindManyArgsSchema)]).optional(),
  reviews: z.union([z.boolean(),z.lazy(() => ReviewFindManyArgsSchema)]).optional(),
  rateLimits: z.union([z.boolean(),z.lazy(() => RateLimitFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  curriculums: z.boolean().optional(),
  userProgress: z.boolean().optional(),
  reviews: z.boolean().optional(),
  rateLimits: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  clerkId: z.boolean().optional(),
  email: z.boolean().optional(),
  username: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  curriculums: z.union([z.boolean(),z.lazy(() => CurriculumFindManyArgsSchema)]).optional(),
  userProgress: z.union([z.boolean(),z.lazy(() => UserProgressFindManyArgsSchema)]).optional(),
  reviews: z.union([z.boolean(),z.lazy(() => ReviewFindManyArgsSchema)]).optional(),
  rateLimits: z.union([z.boolean(),z.lazy(() => RateLimitFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CURRICULUM
//------------------------------------------------------

export const CurriculumIncludeSchema: z.ZodType<Prisma.CurriculumInclude> = z.object({
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  forkedFrom: z.union([z.boolean(),z.lazy(() => CurriculumArgsSchema)]).optional(),
  forks: z.union([z.boolean(),z.lazy(() => CurriculumFindManyArgsSchema)]).optional(),
  userProgress: z.union([z.boolean(),z.lazy(() => UserProgressFindManyArgsSchema)]).optional(),
  reviews: z.union([z.boolean(),z.lazy(() => ReviewFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CurriculumCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CurriculumArgsSchema: z.ZodType<Prisma.CurriculumDefaultArgs> = z.object({
  select: z.lazy(() => CurriculumSelectSchema).optional(),
  include: z.lazy(() => CurriculumIncludeSchema).optional(),
}).strict();

export const CurriculumCountOutputTypeArgsSchema: z.ZodType<Prisma.CurriculumCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CurriculumCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CurriculumCountOutputTypeSelectSchema: z.ZodType<Prisma.CurriculumCountOutputTypeSelect> = z.object({
  forks: z.boolean().optional(),
  userProgress: z.boolean().optional(),
  reviews: z.boolean().optional(),
}).strict();

export const CurriculumSelectSchema: z.ZodType<Prisma.CurriculumSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  domain: z.boolean().optional(),
  content: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  forkCount: z.boolean().optional(),
  creatorId: z.boolean().optional(),
  forkedFromId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  creator: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  forkedFrom: z.union([z.boolean(),z.lazy(() => CurriculumArgsSchema)]).optional(),
  forks: z.union([z.boolean(),z.lazy(() => CurriculumFindManyArgsSchema)]).optional(),
  userProgress: z.union([z.boolean(),z.lazy(() => UserProgressFindManyArgsSchema)]).optional(),
  reviews: z.union([z.boolean(),z.lazy(() => ReviewFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CurriculumCountOutputTypeArgsSchema)]).optional(),
}).strict()

// USER PROGRESS
//------------------------------------------------------

export const UserProgressIncludeSchema: z.ZodType<Prisma.UserProgressInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  curriculum: z.union([z.boolean(),z.lazy(() => CurriculumArgsSchema)]).optional(),
}).strict()

export const UserProgressArgsSchema: z.ZodType<Prisma.UserProgressDefaultArgs> = z.object({
  select: z.lazy(() => UserProgressSelectSchema).optional(),
  include: z.lazy(() => UserProgressIncludeSchema).optional(),
}).strict();

export const UserProgressSelectSchema: z.ZodType<Prisma.UserProgressSelect> = z.object({
  userId: z.boolean().optional(),
  curriculumId: z.boolean().optional(),
  completedSteps: z.boolean().optional(),
  progress: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  curriculum: z.union([z.boolean(),z.lazy(() => CurriculumArgsSchema)]).optional(),
}).strict()

// REVIEW
//------------------------------------------------------

export const ReviewIncludeSchema: z.ZodType<Prisma.ReviewInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  curriculum: z.union([z.boolean(),z.lazy(() => CurriculumArgsSchema)]).optional(),
}).strict()

export const ReviewArgsSchema: z.ZodType<Prisma.ReviewDefaultArgs> = z.object({
  select: z.lazy(() => ReviewSelectSchema).optional(),
  include: z.lazy(() => ReviewIncludeSchema).optional(),
}).strict();

export const ReviewSelectSchema: z.ZodType<Prisma.ReviewSelect> = z.object({
  id: z.boolean().optional(),
  rating: z.boolean().optional(),
  comment: z.boolean().optional(),
  userId: z.boolean().optional(),
  curriculumId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  curriculum: z.union([z.boolean(),z.lazy(() => CurriculumArgsSchema)]).optional(),
}).strict()

// RATE LIMIT
//------------------------------------------------------

export const RateLimitIncludeSchema: z.ZodType<Prisma.RateLimitInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const RateLimitArgsSchema: z.ZodType<Prisma.RateLimitDefaultArgs> = z.object({
  select: z.lazy(() => RateLimitSelectSchema).optional(),
  include: z.lazy(() => RateLimitIncludeSchema).optional(),
}).strict();

export const RateLimitSelectSchema: z.ZodType<Prisma.RateLimitSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  date: z.boolean().optional(),
  count: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  curriculums: z.lazy(() => CurriculumListRelationFilterSchema).optional(),
  userProgress: z.lazy(() => UserProgressListRelationFilterSchema).optional(),
  reviews: z.lazy(() => ReviewListRelationFilterSchema).optional(),
  rateLimits: z.lazy(() => RateLimitListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  curriculums: z.lazy(() => CurriculumOrderByRelationAggregateInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressOrderByRelationAggregateInputSchema).optional(),
  reviews: z.lazy(() => ReviewOrderByRelationAggregateInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    clerkId: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.string(),
    clerkId: z.string(),
  }),
  z.object({
    id: z.string(),
    email: z.string(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    clerkId: z.string(),
    email: z.string(),
  }),
  z.object({
    clerkId: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  clerkId: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  username: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  curriculums: z.lazy(() => CurriculumListRelationFilterSchema).optional(),
  userProgress: z.lazy(() => UserProgressListRelationFilterSchema).optional(),
  reviews: z.lazy(() => ReviewListRelationFilterSchema).optional(),
  rateLimits: z.lazy(() => RateLimitListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  clerkId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CurriculumWhereInputSchema: z.ZodType<Prisma.CurriculumWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CurriculumWhereInputSchema),z.lazy(() => CurriculumWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CurriculumWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CurriculumWhereInputSchema),z.lazy(() => CurriculumWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  domain: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.lazy(() => JsonFilterSchema).optional(),
  isPublic: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  forkCount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  forkedFromId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  forkedFrom: z.union([ z.lazy(() => CurriculumNullableScalarRelationFilterSchema),z.lazy(() => CurriculumWhereInputSchema) ]).optional().nullable(),
  forks: z.lazy(() => CurriculumListRelationFilterSchema).optional(),
  userProgress: z.lazy(() => UserProgressListRelationFilterSchema).optional(),
  reviews: z.lazy(() => ReviewListRelationFilterSchema).optional()
}).strict();

export const CurriculumOrderByWithRelationInputSchema: z.ZodType<Prisma.CurriculumOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  domain: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  forkCount: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  forkedFromId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  creator: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  forkedFrom: z.lazy(() => CurriculumOrderByWithRelationInputSchema).optional(),
  forks: z.lazy(() => CurriculumOrderByRelationAggregateInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressOrderByRelationAggregateInputSchema).optional(),
  reviews: z.lazy(() => ReviewOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CurriculumWhereUniqueInputSchema: z.ZodType<Prisma.CurriculumWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => CurriculumWhereInputSchema),z.lazy(() => CurriculumWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CurriculumWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CurriculumWhereInputSchema),z.lazy(() => CurriculumWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  domain: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.lazy(() => JsonFilterSchema).optional(),
  isPublic: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  forkCount: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  forkedFromId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  creator: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  forkedFrom: z.union([ z.lazy(() => CurriculumNullableScalarRelationFilterSchema),z.lazy(() => CurriculumWhereInputSchema) ]).optional().nullable(),
  forks: z.lazy(() => CurriculumListRelationFilterSchema).optional(),
  userProgress: z.lazy(() => UserProgressListRelationFilterSchema).optional(),
  reviews: z.lazy(() => ReviewListRelationFilterSchema).optional()
}).strict());

export const CurriculumOrderByWithAggregationInputSchema: z.ZodType<Prisma.CurriculumOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  domain: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  forkCount: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  forkedFromId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CurriculumCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CurriculumAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CurriculumMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CurriculumMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CurriculumSumOrderByAggregateInputSchema).optional()
}).strict();

export const CurriculumScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CurriculumScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CurriculumScalarWhereWithAggregatesInputSchema),z.lazy(() => CurriculumScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CurriculumScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CurriculumScalarWhereWithAggregatesInputSchema),z.lazy(() => CurriculumScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  domain: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  content: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  isPublic: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  forkCount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  forkedFromId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserProgressWhereInputSchema: z.ZodType<Prisma.UserProgressWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserProgressWhereInputSchema),z.lazy(() => UserProgressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserProgressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserProgressWhereInputSchema),z.lazy(() => UserProgressWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  curriculumId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  completedSteps: z.lazy(() => JsonFilterSchema).optional(),
  progress: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  curriculum: z.union([ z.lazy(() => CurriculumScalarRelationFilterSchema),z.lazy(() => CurriculumWhereInputSchema) ]).optional(),
}).strict();

export const UserProgressOrderByWithRelationInputSchema: z.ZodType<Prisma.UserProgressOrderByWithRelationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  curriculumId: z.lazy(() => SortOrderSchema).optional(),
  completedSteps: z.lazy(() => SortOrderSchema).optional(),
  progress: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  curriculum: z.lazy(() => CurriculumOrderByWithRelationInputSchema).optional()
}).strict();

export const UserProgressWhereUniqueInputSchema: z.ZodType<Prisma.UserProgressWhereUniqueInput> = z.object({
  userId_curriculumId: z.lazy(() => UserProgressUserIdCurriculumIdCompoundUniqueInputSchema)
})
.and(z.object({
  userId_curriculumId: z.lazy(() => UserProgressUserIdCurriculumIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => UserProgressWhereInputSchema),z.lazy(() => UserProgressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserProgressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserProgressWhereInputSchema),z.lazy(() => UserProgressWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  curriculumId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  completedSteps: z.lazy(() => JsonFilterSchema).optional(),
  progress: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  curriculum: z.union([ z.lazy(() => CurriculumScalarRelationFilterSchema),z.lazy(() => CurriculumWhereInputSchema) ]).optional(),
}).strict());

export const UserProgressOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserProgressOrderByWithAggregationInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  curriculumId: z.lazy(() => SortOrderSchema).optional(),
  completedSteps: z.lazy(() => SortOrderSchema).optional(),
  progress: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserProgressCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserProgressAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserProgressMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserProgressMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserProgressSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserProgressScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserProgressScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserProgressScalarWhereWithAggregatesInputSchema),z.lazy(() => UserProgressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserProgressScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserProgressScalarWhereWithAggregatesInputSchema),z.lazy(() => UserProgressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  curriculumId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  completedSteps: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  progress: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ReviewWhereInputSchema: z.ZodType<Prisma.ReviewWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReviewWhereInputSchema),z.lazy(() => ReviewWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReviewWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReviewWhereInputSchema),z.lazy(() => ReviewWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rating: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  comment: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  curriculumId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  curriculum: z.union([ z.lazy(() => CurriculumScalarRelationFilterSchema),z.lazy(() => CurriculumWhereInputSchema) ]).optional(),
}).strict();

export const ReviewOrderByWithRelationInputSchema: z.ZodType<Prisma.ReviewOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  comment: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  curriculumId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  curriculum: z.lazy(() => CurriculumOrderByWithRelationInputSchema).optional()
}).strict();

export const ReviewWhereUniqueInputSchema: z.ZodType<Prisma.ReviewWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    userId_curriculumId: z.lazy(() => ReviewUserIdCurriculumIdCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    userId_curriculumId: z.lazy(() => ReviewUserIdCurriculumIdCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  userId_curriculumId: z.lazy(() => ReviewUserIdCurriculumIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ReviewWhereInputSchema),z.lazy(() => ReviewWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReviewWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReviewWhereInputSchema),z.lazy(() => ReviewWhereInputSchema).array() ]).optional(),
  rating: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  comment: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  curriculumId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  curriculum: z.union([ z.lazy(() => CurriculumScalarRelationFilterSchema),z.lazy(() => CurriculumWhereInputSchema) ]).optional(),
}).strict());

export const ReviewOrderByWithAggregationInputSchema: z.ZodType<Prisma.ReviewOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  comment: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  curriculumId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ReviewCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ReviewAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ReviewMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ReviewMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ReviewSumOrderByAggregateInputSchema).optional()
}).strict();

export const ReviewScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ReviewScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ReviewScalarWhereWithAggregatesInputSchema),z.lazy(() => ReviewScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReviewScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReviewScalarWhereWithAggregatesInputSchema),z.lazy(() => ReviewScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  rating: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  comment: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  curriculumId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const RateLimitWhereInputSchema: z.ZodType<Prisma.RateLimitWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RateLimitWhereInputSchema),z.lazy(() => RateLimitWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RateLimitWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RateLimitWhereInputSchema),z.lazy(() => RateLimitWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  count: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const RateLimitOrderByWithRelationInputSchema: z.ZodType<Prisma.RateLimitOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  count: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const RateLimitWhereUniqueInputSchema: z.ZodType<Prisma.RateLimitWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    userId_date: z.lazy(() => RateLimitUserIdDateCompoundUniqueInputSchema)
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    userId_date: z.lazy(() => RateLimitUserIdDateCompoundUniqueInputSchema),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  userId_date: z.lazy(() => RateLimitUserIdDateCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => RateLimitWhereInputSchema),z.lazy(() => RateLimitWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RateLimitWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RateLimitWhereInputSchema),z.lazy(() => RateLimitWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  count: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const RateLimitOrderByWithAggregationInputSchema: z.ZodType<Prisma.RateLimitOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  count: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RateLimitCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RateLimitAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RateLimitMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RateLimitMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RateLimitSumOrderByAggregateInputSchema).optional()
}).strict();

export const RateLimitScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RateLimitScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RateLimitScalarWhereWithAggregatesInputSchema),z.lazy(() => RateLimitScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RateLimitScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RateLimitScalarWhereWithAggregatesInputSchema),z.lazy(() => RateLimitScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  count: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  curriculums: z.lazy(() => CurriculumCreateNestedManyWithoutCreatorInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressCreateNestedManyWithoutUserInputSchema).optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  curriculums: z.lazy(() => CurriculumUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  curriculums: z.lazy(() => CurriculumUpdateManyWithoutCreatorNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUpdateManyWithoutUserNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  curriculums: z.lazy(() => CurriculumUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CurriculumCreateInputSchema: z.ZodType<Prisma.CurriculumCreateInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCurriculumsInputSchema),
  forkedFrom: z.lazy(() => CurriculumCreateNestedOneWithoutForksInputSchema).optional(),
  forks: z.lazy(() => CurriculumCreateNestedManyWithoutForkedFromInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressCreateNestedManyWithoutCurriculumInputSchema).optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumUncheckedCreateInputSchema: z.ZodType<Prisma.CurriculumUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  creatorId: z.string(),
  forkedFromId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  forks: z.lazy(() => CurriculumUncheckedCreateNestedManyWithoutForkedFromInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedCreateNestedManyWithoutCurriculumInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumUpdateInputSchema: z.ZodType<Prisma.CurriculumUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCurriculumsNestedInputSchema).optional(),
  forkedFrom: z.lazy(() => CurriculumUpdateOneWithoutForksNestedInputSchema).optional(),
  forks: z.lazy(() => CurriculumUpdateManyWithoutForkedFromNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUpdateManyWithoutCurriculumNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const CurriculumUncheckedUpdateInputSchema: z.ZodType<Prisma.CurriculumUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  forks: z.lazy(() => CurriculumUncheckedUpdateManyWithoutForkedFromNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedUpdateManyWithoutCurriculumNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const CurriculumCreateManyInputSchema: z.ZodType<Prisma.CurriculumCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  creatorId: z.string(),
  forkedFromId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CurriculumUpdateManyMutationInputSchema: z.ZodType<Prisma.CurriculumUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CurriculumUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CurriculumUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserProgressCreateInputSchema: z.ZodType<Prisma.UserProgressCreateInput> = z.object({
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  progress: z.number().int().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutUserProgressInputSchema),
  curriculum: z.lazy(() => CurriculumCreateNestedOneWithoutUserProgressInputSchema)
}).strict();

export const UserProgressUncheckedCreateInputSchema: z.ZodType<Prisma.UserProgressUncheckedCreateInput> = z.object({
  userId: z.string(),
  curriculumId: z.string(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  progress: z.number().int().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserProgressUpdateInputSchema: z.ZodType<Prisma.UserProgressUpdateInput> = z.object({
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  progress: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutUserProgressNestedInputSchema).optional(),
  curriculum: z.lazy(() => CurriculumUpdateOneRequiredWithoutUserProgressNestedInputSchema).optional()
}).strict();

export const UserProgressUncheckedUpdateInputSchema: z.ZodType<Prisma.UserProgressUncheckedUpdateInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  curriculumId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  progress: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserProgressCreateManyInputSchema: z.ZodType<Prisma.UserProgressCreateManyInput> = z.object({
  userId: z.string(),
  curriculumId: z.string(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  progress: z.number().int().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserProgressUpdateManyMutationInputSchema: z.ZodType<Prisma.UserProgressUpdateManyMutationInput> = z.object({
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  progress: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserProgressUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserProgressUncheckedUpdateManyInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  curriculumId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  progress: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReviewCreateInputSchema: z.ZodType<Prisma.ReviewCreateInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  comment: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutReviewsInputSchema),
  curriculum: z.lazy(() => CurriculumCreateNestedOneWithoutReviewsInputSchema)
}).strict();

export const ReviewUncheckedCreateInputSchema: z.ZodType<Prisma.ReviewUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  comment: z.string().optional().nullable(),
  userId: z.string(),
  curriculumId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ReviewUpdateInputSchema: z.ZodType<Prisma.ReviewUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutReviewsNestedInputSchema).optional(),
  curriculum: z.lazy(() => CurriculumUpdateOneRequiredWithoutReviewsNestedInputSchema).optional()
}).strict();

export const ReviewUncheckedUpdateInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  curriculumId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReviewCreateManyInputSchema: z.ZodType<Prisma.ReviewCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  comment: z.string().optional().nullable(),
  userId: z.string(),
  curriculumId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ReviewUpdateManyMutationInputSchema: z.ZodType<Prisma.ReviewUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReviewUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  curriculumId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RateLimitCreateInputSchema: z.ZodType<Prisma.RateLimitCreateInput> = z.object({
  id: z.string().cuid().optional(),
  date: z.string(),
  count: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutRateLimitsInputSchema)
}).strict();

export const RateLimitUncheckedCreateInputSchema: z.ZodType<Prisma.RateLimitUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  date: z.string(),
  count: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RateLimitUpdateInputSchema: z.ZodType<Prisma.RateLimitUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  count: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRateLimitsNestedInputSchema).optional()
}).strict();

export const RateLimitUncheckedUpdateInputSchema: z.ZodType<Prisma.RateLimitUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  count: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RateLimitCreateManyInputSchema: z.ZodType<Prisma.RateLimitCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  date: z.string(),
  count: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RateLimitUpdateManyMutationInputSchema: z.ZodType<Prisma.RateLimitUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  count: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RateLimitUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RateLimitUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  count: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const CurriculumListRelationFilterSchema: z.ZodType<Prisma.CurriculumListRelationFilter> = z.object({
  every: z.lazy(() => CurriculumWhereInputSchema).optional(),
  some: z.lazy(() => CurriculumWhereInputSchema).optional(),
  none: z.lazy(() => CurriculumWhereInputSchema).optional()
}).strict();

export const UserProgressListRelationFilterSchema: z.ZodType<Prisma.UserProgressListRelationFilter> = z.object({
  every: z.lazy(() => UserProgressWhereInputSchema).optional(),
  some: z.lazy(() => UserProgressWhereInputSchema).optional(),
  none: z.lazy(() => UserProgressWhereInputSchema).optional()
}).strict();

export const ReviewListRelationFilterSchema: z.ZodType<Prisma.ReviewListRelationFilter> = z.object({
  every: z.lazy(() => ReviewWhereInputSchema).optional(),
  some: z.lazy(() => ReviewWhereInputSchema).optional(),
  none: z.lazy(() => ReviewWhereInputSchema).optional()
}).strict();

export const RateLimitListRelationFilterSchema: z.ZodType<Prisma.RateLimitListRelationFilter> = z.object({
  every: z.lazy(() => RateLimitWhereInputSchema).optional(),
  some: z.lazy(() => RateLimitWhereInputSchema).optional(),
  none: z.lazy(() => RateLimitWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const CurriculumOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CurriculumOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserProgressOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserProgressOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ReviewOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RateLimitOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RateLimitOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  clerkId: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const CurriculumNullableScalarRelationFilterSchema: z.ZodType<Prisma.CurriculumNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => CurriculumWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CurriculumWhereInputSchema).optional().nullable()
}).strict();

export const CurriculumCountOrderByAggregateInputSchema: z.ZodType<Prisma.CurriculumCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  domain: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  forkCount: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  forkedFromId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CurriculumAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CurriculumAvgOrderByAggregateInput> = z.object({
  forkCount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CurriculumMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CurriculumMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  domain: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  forkCount: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  forkedFromId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CurriculumMinOrderByAggregateInputSchema: z.ZodType<Prisma.CurriculumMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  domain: z.lazy(() => SortOrderSchema).optional(),
  isPublic: z.lazy(() => SortOrderSchema).optional(),
  forkCount: z.lazy(() => SortOrderSchema).optional(),
  creatorId: z.lazy(() => SortOrderSchema).optional(),
  forkedFromId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CurriculumSumOrderByAggregateInputSchema: z.ZodType<Prisma.CurriculumSumOrderByAggregateInput> = z.object({
  forkCount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const CurriculumScalarRelationFilterSchema: z.ZodType<Prisma.CurriculumScalarRelationFilter> = z.object({
  is: z.lazy(() => CurriculumWhereInputSchema).optional(),
  isNot: z.lazy(() => CurriculumWhereInputSchema).optional()
}).strict();

export const UserProgressUserIdCurriculumIdCompoundUniqueInputSchema: z.ZodType<Prisma.UserProgressUserIdCurriculumIdCompoundUniqueInput> = z.object({
  userId: z.string(),
  curriculumId: z.string()
}).strict();

export const UserProgressCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserProgressCountOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  curriculumId: z.lazy(() => SortOrderSchema).optional(),
  completedSteps: z.lazy(() => SortOrderSchema).optional(),
  progress: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserProgressAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserProgressAvgOrderByAggregateInput> = z.object({
  progress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserProgressMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserProgressMaxOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  curriculumId: z.lazy(() => SortOrderSchema).optional(),
  progress: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserProgressMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserProgressMinOrderByAggregateInput> = z.object({
  userId: z.lazy(() => SortOrderSchema).optional(),
  curriculumId: z.lazy(() => SortOrderSchema).optional(),
  progress: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserProgressSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserProgressSumOrderByAggregateInput> = z.object({
  progress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewUserIdCurriculumIdCompoundUniqueInputSchema: z.ZodType<Prisma.ReviewUserIdCurriculumIdCompoundUniqueInput> = z.object({
  userId: z.string(),
  curriculumId: z.string()
}).strict();

export const ReviewCountOrderByAggregateInputSchema: z.ZodType<Prisma.ReviewCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  curriculumId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ReviewAvgOrderByAggregateInput> = z.object({
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ReviewMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  curriculumId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewMinOrderByAggregateInputSchema: z.ZodType<Prisma.ReviewMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  rating: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  curriculumId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ReviewSumOrderByAggregateInputSchema: z.ZodType<Prisma.ReviewSumOrderByAggregateInput> = z.object({
  rating: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RateLimitUserIdDateCompoundUniqueInputSchema: z.ZodType<Prisma.RateLimitUserIdDateCompoundUniqueInput> = z.object({
  userId: z.string(),
  date: z.string()
}).strict();

export const RateLimitCountOrderByAggregateInputSchema: z.ZodType<Prisma.RateLimitCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  count: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RateLimitAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RateLimitAvgOrderByAggregateInput> = z.object({
  count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RateLimitMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RateLimitMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  count: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RateLimitMinOrderByAggregateInputSchema: z.ZodType<Prisma.RateLimitMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  count: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RateLimitSumOrderByAggregateInputSchema: z.ZodType<Prisma.RateLimitSumOrderByAggregateInput> = z.object({
  count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CurriculumCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.CurriculumCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutCreatorInputSchema),z.lazy(() => CurriculumCreateWithoutCreatorInputSchema).array(),z.lazy(() => CurriculumUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CurriculumCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => CurriculumCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CurriculumCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserProgressCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserProgressCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserProgressCreateWithoutUserInputSchema),z.lazy(() => UserProgressCreateWithoutUserInputSchema).array(),z.lazy(() => UserProgressUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserProgressCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserProgressCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserProgressCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReviewCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ReviewCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewCreateWithoutUserInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RateLimitCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.RateLimitCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => RateLimitCreateWithoutUserInputSchema),z.lazy(() => RateLimitCreateWithoutUserInputSchema).array(),z.lazy(() => RateLimitUncheckedCreateWithoutUserInputSchema),z.lazy(() => RateLimitUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RateLimitCreateOrConnectWithoutUserInputSchema),z.lazy(() => RateLimitCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RateLimitCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RateLimitWhereUniqueInputSchema),z.lazy(() => RateLimitWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CurriculumUncheckedCreateNestedManyWithoutCreatorInputSchema: z.ZodType<Prisma.CurriculumUncheckedCreateNestedManyWithoutCreatorInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutCreatorInputSchema),z.lazy(() => CurriculumCreateWithoutCreatorInputSchema).array(),z.lazy(() => CurriculumUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CurriculumCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => CurriculumCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CurriculumCreateManyCreatorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserProgressUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.UserProgressUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => UserProgressCreateWithoutUserInputSchema),z.lazy(() => UserProgressCreateWithoutUserInputSchema).array(),z.lazy(() => UserProgressUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserProgressCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserProgressCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserProgressCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReviewUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ReviewUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewCreateWithoutUserInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RateLimitUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.RateLimitUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => RateLimitCreateWithoutUserInputSchema),z.lazy(() => RateLimitCreateWithoutUserInputSchema).array(),z.lazy(() => RateLimitUncheckedCreateWithoutUserInputSchema),z.lazy(() => RateLimitUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RateLimitCreateOrConnectWithoutUserInputSchema),z.lazy(() => RateLimitCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RateLimitCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RateLimitWhereUniqueInputSchema),z.lazy(() => RateLimitWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const CurriculumUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.CurriculumUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutCreatorInputSchema),z.lazy(() => CurriculumCreateWithoutCreatorInputSchema).array(),z.lazy(() => CurriculumUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CurriculumCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => CurriculumCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CurriculumUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => CurriculumUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CurriculumCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CurriculumUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => CurriculumUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CurriculumUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => CurriculumUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CurriculumScalarWhereInputSchema),z.lazy(() => CurriculumScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserProgressUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserProgressUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserProgressCreateWithoutUserInputSchema),z.lazy(() => UserProgressCreateWithoutUserInputSchema).array(),z.lazy(() => UserProgressUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserProgressCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserProgressCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserProgressUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserProgressUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserProgressCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserProgressUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserProgressUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserProgressUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserProgressUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserProgressScalarWhereInputSchema),z.lazy(() => UserProgressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReviewUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ReviewUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewCreateWithoutUserInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReviewUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReviewUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReviewUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReviewUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReviewUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ReviewUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RateLimitUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.RateLimitUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => RateLimitCreateWithoutUserInputSchema),z.lazy(() => RateLimitCreateWithoutUserInputSchema).array(),z.lazy(() => RateLimitUncheckedCreateWithoutUserInputSchema),z.lazy(() => RateLimitUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RateLimitCreateOrConnectWithoutUserInputSchema),z.lazy(() => RateLimitCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RateLimitUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RateLimitUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RateLimitCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RateLimitWhereUniqueInputSchema),z.lazy(() => RateLimitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RateLimitWhereUniqueInputSchema),z.lazy(() => RateLimitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RateLimitWhereUniqueInputSchema),z.lazy(() => RateLimitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RateLimitWhereUniqueInputSchema),z.lazy(() => RateLimitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RateLimitUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RateLimitUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RateLimitUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => RateLimitUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RateLimitScalarWhereInputSchema),z.lazy(() => RateLimitScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CurriculumUncheckedUpdateManyWithoutCreatorNestedInputSchema: z.ZodType<Prisma.CurriculumUncheckedUpdateManyWithoutCreatorNestedInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutCreatorInputSchema),z.lazy(() => CurriculumCreateWithoutCreatorInputSchema).array(),z.lazy(() => CurriculumUncheckedCreateWithoutCreatorInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutCreatorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CurriculumCreateOrConnectWithoutCreatorInputSchema),z.lazy(() => CurriculumCreateOrConnectWithoutCreatorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CurriculumUpsertWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => CurriculumUpsertWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CurriculumCreateManyCreatorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CurriculumUpdateWithWhereUniqueWithoutCreatorInputSchema),z.lazy(() => CurriculumUpdateWithWhereUniqueWithoutCreatorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CurriculumUpdateManyWithWhereWithoutCreatorInputSchema),z.lazy(() => CurriculumUpdateManyWithWhereWithoutCreatorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CurriculumScalarWhereInputSchema),z.lazy(() => CurriculumScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserProgressUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.UserProgressUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserProgressCreateWithoutUserInputSchema),z.lazy(() => UserProgressCreateWithoutUserInputSchema).array(),z.lazy(() => UserProgressUncheckedCreateWithoutUserInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserProgressCreateOrConnectWithoutUserInputSchema),z.lazy(() => UserProgressCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserProgressUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserProgressUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserProgressCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserProgressUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => UserProgressUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserProgressUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => UserProgressUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserProgressScalarWhereInputSchema),z.lazy(() => UserProgressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReviewUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewCreateWithoutUserInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReviewUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReviewUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReviewUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ReviewUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReviewUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ReviewUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RateLimitUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.RateLimitUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => RateLimitCreateWithoutUserInputSchema),z.lazy(() => RateLimitCreateWithoutUserInputSchema).array(),z.lazy(() => RateLimitUncheckedCreateWithoutUserInputSchema),z.lazy(() => RateLimitUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RateLimitCreateOrConnectWithoutUserInputSchema),z.lazy(() => RateLimitCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RateLimitUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RateLimitUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RateLimitCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RateLimitWhereUniqueInputSchema),z.lazy(() => RateLimitWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RateLimitWhereUniqueInputSchema),z.lazy(() => RateLimitWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RateLimitWhereUniqueInputSchema),z.lazy(() => RateLimitWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RateLimitWhereUniqueInputSchema),z.lazy(() => RateLimitWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RateLimitUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RateLimitUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RateLimitUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => RateLimitUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RateLimitScalarWhereInputSchema),z.lazy(() => RateLimitScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutCurriculumsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCurriculumsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCurriculumsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCurriculumsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCurriculumsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CurriculumCreateNestedOneWithoutForksInputSchema: z.ZodType<Prisma.CurriculumCreateNestedOneWithoutForksInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutForksInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutForksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurriculumCreateOrConnectWithoutForksInputSchema).optional(),
  connect: z.lazy(() => CurriculumWhereUniqueInputSchema).optional()
}).strict();

export const CurriculumCreateNestedManyWithoutForkedFromInputSchema: z.ZodType<Prisma.CurriculumCreateNestedManyWithoutForkedFromInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutForkedFromInputSchema),z.lazy(() => CurriculumCreateWithoutForkedFromInputSchema).array(),z.lazy(() => CurriculumUncheckedCreateWithoutForkedFromInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutForkedFromInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CurriculumCreateOrConnectWithoutForkedFromInputSchema),z.lazy(() => CurriculumCreateOrConnectWithoutForkedFromInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CurriculumCreateManyForkedFromInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserProgressCreateNestedManyWithoutCurriculumInputSchema: z.ZodType<Prisma.UserProgressCreateNestedManyWithoutCurriculumInput> = z.object({
  create: z.union([ z.lazy(() => UserProgressCreateWithoutCurriculumInputSchema),z.lazy(() => UserProgressCreateWithoutCurriculumInputSchema).array(),z.lazy(() => UserProgressUncheckedCreateWithoutCurriculumInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutCurriculumInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserProgressCreateOrConnectWithoutCurriculumInputSchema),z.lazy(() => UserProgressCreateOrConnectWithoutCurriculumInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserProgressCreateManyCurriculumInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReviewCreateNestedManyWithoutCurriculumInputSchema: z.ZodType<Prisma.ReviewCreateNestedManyWithoutCurriculumInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutCurriculumInputSchema),z.lazy(() => ReviewCreateWithoutCurriculumInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutCurriculumInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutCurriculumInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutCurriculumInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutCurriculumInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyCurriculumInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CurriculumUncheckedCreateNestedManyWithoutForkedFromInputSchema: z.ZodType<Prisma.CurriculumUncheckedCreateNestedManyWithoutForkedFromInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutForkedFromInputSchema),z.lazy(() => CurriculumCreateWithoutForkedFromInputSchema).array(),z.lazy(() => CurriculumUncheckedCreateWithoutForkedFromInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutForkedFromInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CurriculumCreateOrConnectWithoutForkedFromInputSchema),z.lazy(() => CurriculumCreateOrConnectWithoutForkedFromInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CurriculumCreateManyForkedFromInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserProgressUncheckedCreateNestedManyWithoutCurriculumInputSchema: z.ZodType<Prisma.UserProgressUncheckedCreateNestedManyWithoutCurriculumInput> = z.object({
  create: z.union([ z.lazy(() => UserProgressCreateWithoutCurriculumInputSchema),z.lazy(() => UserProgressCreateWithoutCurriculumInputSchema).array(),z.lazy(() => UserProgressUncheckedCreateWithoutCurriculumInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutCurriculumInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserProgressCreateOrConnectWithoutCurriculumInputSchema),z.lazy(() => UserProgressCreateOrConnectWithoutCurriculumInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserProgressCreateManyCurriculumInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ReviewUncheckedCreateNestedManyWithoutCurriculumInputSchema: z.ZodType<Prisma.ReviewUncheckedCreateNestedManyWithoutCurriculumInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutCurriculumInputSchema),z.lazy(() => ReviewCreateWithoutCurriculumInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutCurriculumInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutCurriculumInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutCurriculumInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutCurriculumInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyCurriculumInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserUpdateOneRequiredWithoutCurriculumsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCurriculumsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCurriculumsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCurriculumsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCurriculumsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCurriculumsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCurriculumsInputSchema),z.lazy(() => UserUpdateWithoutCurriculumsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCurriculumsInputSchema) ]).optional(),
}).strict();

export const CurriculumUpdateOneWithoutForksNestedInputSchema: z.ZodType<Prisma.CurriculumUpdateOneWithoutForksNestedInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutForksInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutForksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurriculumCreateOrConnectWithoutForksInputSchema).optional(),
  upsert: z.lazy(() => CurriculumUpsertWithoutForksInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CurriculumWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CurriculumWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CurriculumWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CurriculumUpdateToOneWithWhereWithoutForksInputSchema),z.lazy(() => CurriculumUpdateWithoutForksInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutForksInputSchema) ]).optional(),
}).strict();

export const CurriculumUpdateManyWithoutForkedFromNestedInputSchema: z.ZodType<Prisma.CurriculumUpdateManyWithoutForkedFromNestedInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutForkedFromInputSchema),z.lazy(() => CurriculumCreateWithoutForkedFromInputSchema).array(),z.lazy(() => CurriculumUncheckedCreateWithoutForkedFromInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutForkedFromInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CurriculumCreateOrConnectWithoutForkedFromInputSchema),z.lazy(() => CurriculumCreateOrConnectWithoutForkedFromInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CurriculumUpsertWithWhereUniqueWithoutForkedFromInputSchema),z.lazy(() => CurriculumUpsertWithWhereUniqueWithoutForkedFromInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CurriculumCreateManyForkedFromInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CurriculumUpdateWithWhereUniqueWithoutForkedFromInputSchema),z.lazy(() => CurriculumUpdateWithWhereUniqueWithoutForkedFromInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CurriculumUpdateManyWithWhereWithoutForkedFromInputSchema),z.lazy(() => CurriculumUpdateManyWithWhereWithoutForkedFromInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CurriculumScalarWhereInputSchema),z.lazy(() => CurriculumScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserProgressUpdateManyWithoutCurriculumNestedInputSchema: z.ZodType<Prisma.UserProgressUpdateManyWithoutCurriculumNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserProgressCreateWithoutCurriculumInputSchema),z.lazy(() => UserProgressCreateWithoutCurriculumInputSchema).array(),z.lazy(() => UserProgressUncheckedCreateWithoutCurriculumInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutCurriculumInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserProgressCreateOrConnectWithoutCurriculumInputSchema),z.lazy(() => UserProgressCreateOrConnectWithoutCurriculumInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserProgressUpsertWithWhereUniqueWithoutCurriculumInputSchema),z.lazy(() => UserProgressUpsertWithWhereUniqueWithoutCurriculumInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserProgressCreateManyCurriculumInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserProgressUpdateWithWhereUniqueWithoutCurriculumInputSchema),z.lazy(() => UserProgressUpdateWithWhereUniqueWithoutCurriculumInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserProgressUpdateManyWithWhereWithoutCurriculumInputSchema),z.lazy(() => UserProgressUpdateManyWithWhereWithoutCurriculumInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserProgressScalarWhereInputSchema),z.lazy(() => UserProgressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReviewUpdateManyWithoutCurriculumNestedInputSchema: z.ZodType<Prisma.ReviewUpdateManyWithoutCurriculumNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutCurriculumInputSchema),z.lazy(() => ReviewCreateWithoutCurriculumInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutCurriculumInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutCurriculumInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutCurriculumInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutCurriculumInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReviewUpsertWithWhereUniqueWithoutCurriculumInputSchema),z.lazy(() => ReviewUpsertWithWhereUniqueWithoutCurriculumInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyCurriculumInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReviewUpdateWithWhereUniqueWithoutCurriculumInputSchema),z.lazy(() => ReviewUpdateWithWhereUniqueWithoutCurriculumInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReviewUpdateManyWithWhereWithoutCurriculumInputSchema),z.lazy(() => ReviewUpdateManyWithWhereWithoutCurriculumInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CurriculumUncheckedUpdateManyWithoutForkedFromNestedInputSchema: z.ZodType<Prisma.CurriculumUncheckedUpdateManyWithoutForkedFromNestedInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutForkedFromInputSchema),z.lazy(() => CurriculumCreateWithoutForkedFromInputSchema).array(),z.lazy(() => CurriculumUncheckedCreateWithoutForkedFromInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutForkedFromInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CurriculumCreateOrConnectWithoutForkedFromInputSchema),z.lazy(() => CurriculumCreateOrConnectWithoutForkedFromInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CurriculumUpsertWithWhereUniqueWithoutForkedFromInputSchema),z.lazy(() => CurriculumUpsertWithWhereUniqueWithoutForkedFromInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CurriculumCreateManyForkedFromInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CurriculumWhereUniqueInputSchema),z.lazy(() => CurriculumWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CurriculumUpdateWithWhereUniqueWithoutForkedFromInputSchema),z.lazy(() => CurriculumUpdateWithWhereUniqueWithoutForkedFromInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CurriculumUpdateManyWithWhereWithoutForkedFromInputSchema),z.lazy(() => CurriculumUpdateManyWithWhereWithoutForkedFromInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CurriculumScalarWhereInputSchema),z.lazy(() => CurriculumScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserProgressUncheckedUpdateManyWithoutCurriculumNestedInputSchema: z.ZodType<Prisma.UserProgressUncheckedUpdateManyWithoutCurriculumNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserProgressCreateWithoutCurriculumInputSchema),z.lazy(() => UserProgressCreateWithoutCurriculumInputSchema).array(),z.lazy(() => UserProgressUncheckedCreateWithoutCurriculumInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutCurriculumInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserProgressCreateOrConnectWithoutCurriculumInputSchema),z.lazy(() => UserProgressCreateOrConnectWithoutCurriculumInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserProgressUpsertWithWhereUniqueWithoutCurriculumInputSchema),z.lazy(() => UserProgressUpsertWithWhereUniqueWithoutCurriculumInputSchema).array() ]).optional(),
  createMany: z.lazy(() => UserProgressCreateManyCurriculumInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserProgressWhereUniqueInputSchema),z.lazy(() => UserProgressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserProgressUpdateWithWhereUniqueWithoutCurriculumInputSchema),z.lazy(() => UserProgressUpdateWithWhereUniqueWithoutCurriculumInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserProgressUpdateManyWithWhereWithoutCurriculumInputSchema),z.lazy(() => UserProgressUpdateManyWithWhereWithoutCurriculumInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserProgressScalarWhereInputSchema),z.lazy(() => UserProgressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ReviewUncheckedUpdateManyWithoutCurriculumNestedInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateManyWithoutCurriculumNestedInput> = z.object({
  create: z.union([ z.lazy(() => ReviewCreateWithoutCurriculumInputSchema),z.lazy(() => ReviewCreateWithoutCurriculumInputSchema).array(),z.lazy(() => ReviewUncheckedCreateWithoutCurriculumInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutCurriculumInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ReviewCreateOrConnectWithoutCurriculumInputSchema),z.lazy(() => ReviewCreateOrConnectWithoutCurriculumInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ReviewUpsertWithWhereUniqueWithoutCurriculumInputSchema),z.lazy(() => ReviewUpsertWithWhereUniqueWithoutCurriculumInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ReviewCreateManyCurriculumInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ReviewWhereUniqueInputSchema),z.lazy(() => ReviewWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ReviewUpdateWithWhereUniqueWithoutCurriculumInputSchema),z.lazy(() => ReviewUpdateWithWhereUniqueWithoutCurriculumInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ReviewUpdateManyWithWhereWithoutCurriculumInputSchema),z.lazy(() => ReviewUpdateManyWithWhereWithoutCurriculumInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutUserProgressInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutUserProgressInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserProgressInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserProgressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserProgressInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CurriculumCreateNestedOneWithoutUserProgressInputSchema: z.ZodType<Prisma.CurriculumCreateNestedOneWithoutUserProgressInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutUserProgressInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutUserProgressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurriculumCreateOrConnectWithoutUserProgressInputSchema).optional(),
  connect: z.lazy(() => CurriculumWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutUserProgressNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutUserProgressNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutUserProgressInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserProgressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutUserProgressInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutUserProgressInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutUserProgressInputSchema),z.lazy(() => UserUpdateWithoutUserProgressInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserProgressInputSchema) ]).optional(),
}).strict();

export const CurriculumUpdateOneRequiredWithoutUserProgressNestedInputSchema: z.ZodType<Prisma.CurriculumUpdateOneRequiredWithoutUserProgressNestedInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutUserProgressInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutUserProgressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurriculumCreateOrConnectWithoutUserProgressInputSchema).optional(),
  upsert: z.lazy(() => CurriculumUpsertWithoutUserProgressInputSchema).optional(),
  connect: z.lazy(() => CurriculumWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CurriculumUpdateToOneWithWhereWithoutUserProgressInputSchema),z.lazy(() => CurriculumUpdateWithoutUserProgressInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutUserProgressInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutReviewsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutReviewsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReviewsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReviewsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReviewsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CurriculumCreateNestedOneWithoutReviewsInputSchema: z.ZodType<Prisma.CurriculumCreateNestedOneWithoutReviewsInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutReviewsInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutReviewsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurriculumCreateOrConnectWithoutReviewsInputSchema).optional(),
  connect: z.lazy(() => CurriculumWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutReviewsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutReviewsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReviewsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReviewsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReviewsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutReviewsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutReviewsInputSchema),z.lazy(() => UserUpdateWithoutReviewsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReviewsInputSchema) ]).optional(),
}).strict();

export const CurriculumUpdateOneRequiredWithoutReviewsNestedInputSchema: z.ZodType<Prisma.CurriculumUpdateOneRequiredWithoutReviewsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CurriculumCreateWithoutReviewsInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutReviewsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CurriculumCreateOrConnectWithoutReviewsInputSchema).optional(),
  upsert: z.lazy(() => CurriculumUpsertWithoutReviewsInputSchema).optional(),
  connect: z.lazy(() => CurriculumWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CurriculumUpdateToOneWithWhereWithoutReviewsInputSchema),z.lazy(() => CurriculumUpdateWithoutReviewsInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutReviewsInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutRateLimitsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutRateLimitsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRateLimitsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRateLimitsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRateLimitsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutRateLimitsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutRateLimitsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRateLimitsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRateLimitsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRateLimitsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutRateLimitsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutRateLimitsInputSchema),z.lazy(() => UserUpdateWithoutRateLimitsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRateLimitsInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const CurriculumCreateWithoutCreatorInputSchema: z.ZodType<Prisma.CurriculumCreateWithoutCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  forkedFrom: z.lazy(() => CurriculumCreateNestedOneWithoutForksInputSchema).optional(),
  forks: z.lazy(() => CurriculumCreateNestedManyWithoutForkedFromInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressCreateNestedManyWithoutCurriculumInputSchema).optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumUncheckedCreateWithoutCreatorInputSchema: z.ZodType<Prisma.CurriculumUncheckedCreateWithoutCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  forkedFromId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  forks: z.lazy(() => CurriculumUncheckedCreateNestedManyWithoutForkedFromInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedCreateNestedManyWithoutCurriculumInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumCreateOrConnectWithoutCreatorInputSchema: z.ZodType<Prisma.CurriculumCreateOrConnectWithoutCreatorInput> = z.object({
  where: z.lazy(() => CurriculumWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CurriculumCreateWithoutCreatorInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const CurriculumCreateManyCreatorInputEnvelopeSchema: z.ZodType<Prisma.CurriculumCreateManyCreatorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CurriculumCreateManyCreatorInputSchema),z.lazy(() => CurriculumCreateManyCreatorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserProgressCreateWithoutUserInputSchema: z.ZodType<Prisma.UserProgressCreateWithoutUserInput> = z.object({
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  progress: z.number().int().optional(),
  updatedAt: z.coerce.date().optional(),
  curriculum: z.lazy(() => CurriculumCreateNestedOneWithoutUserProgressInputSchema)
}).strict();

export const UserProgressUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.UserProgressUncheckedCreateWithoutUserInput> = z.object({
  curriculumId: z.string(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  progress: z.number().int().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserProgressCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.UserProgressCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => UserProgressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserProgressCreateWithoutUserInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserProgressCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.UserProgressCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserProgressCreateManyUserInputSchema),z.lazy(() => UserProgressCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ReviewCreateWithoutUserInputSchema: z.ZodType<Prisma.ReviewCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  comment: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  curriculum: z.lazy(() => CurriculumCreateNestedOneWithoutReviewsInputSchema)
}).strict();

export const ReviewUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ReviewUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  comment: z.string().optional().nullable(),
  curriculumId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ReviewCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ReviewCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ReviewCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ReviewCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReviewCreateManyUserInputSchema),z.lazy(() => ReviewCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const RateLimitCreateWithoutUserInputSchema: z.ZodType<Prisma.RateLimitCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  date: z.string(),
  count: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RateLimitUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.RateLimitUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  date: z.string(),
  count: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RateLimitCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.RateLimitCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => RateLimitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RateLimitCreateWithoutUserInputSchema),z.lazy(() => RateLimitUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const RateLimitCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.RateLimitCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RateLimitCreateManyUserInputSchema),z.lazy(() => RateLimitCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CurriculumUpsertWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.CurriculumUpsertWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => CurriculumWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CurriculumUpdateWithoutCreatorInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutCreatorInputSchema) ]),
  create: z.union([ z.lazy(() => CurriculumCreateWithoutCreatorInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutCreatorInputSchema) ]),
}).strict();

export const CurriculumUpdateWithWhereUniqueWithoutCreatorInputSchema: z.ZodType<Prisma.CurriculumUpdateWithWhereUniqueWithoutCreatorInput> = z.object({
  where: z.lazy(() => CurriculumWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CurriculumUpdateWithoutCreatorInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutCreatorInputSchema) ]),
}).strict();

export const CurriculumUpdateManyWithWhereWithoutCreatorInputSchema: z.ZodType<Prisma.CurriculumUpdateManyWithWhereWithoutCreatorInput> = z.object({
  where: z.lazy(() => CurriculumScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CurriculumUpdateManyMutationInputSchema),z.lazy(() => CurriculumUncheckedUpdateManyWithoutCreatorInputSchema) ]),
}).strict();

export const CurriculumScalarWhereInputSchema: z.ZodType<Prisma.CurriculumScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CurriculumScalarWhereInputSchema),z.lazy(() => CurriculumScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CurriculumScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CurriculumScalarWhereInputSchema),z.lazy(() => CurriculumScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  domain: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.lazy(() => JsonFilterSchema).optional(),
  isPublic: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  forkCount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  creatorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  forkedFromId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserProgressUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserProgressUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserProgressWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserProgressUpdateWithoutUserInputSchema),z.lazy(() => UserProgressUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => UserProgressCreateWithoutUserInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const UserProgressUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.UserProgressUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => UserProgressWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserProgressUpdateWithoutUserInputSchema),z.lazy(() => UserProgressUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const UserProgressUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.UserProgressUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => UserProgressScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserProgressUpdateManyMutationInputSchema),z.lazy(() => UserProgressUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const UserProgressScalarWhereInputSchema: z.ZodType<Prisma.UserProgressScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserProgressScalarWhereInputSchema),z.lazy(() => UserProgressScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserProgressScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserProgressScalarWhereInputSchema),z.lazy(() => UserProgressScalarWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  curriculumId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  completedSteps: z.lazy(() => JsonFilterSchema).optional(),
  progress: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ReviewUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ReviewUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReviewUpdateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ReviewCreateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ReviewUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ReviewUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReviewUpdateWithoutUserInputSchema),z.lazy(() => ReviewUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ReviewUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ReviewUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ReviewScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReviewUpdateManyMutationInputSchema),z.lazy(() => ReviewUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ReviewScalarWhereInputSchema: z.ZodType<Prisma.ReviewScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ReviewScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ReviewScalarWhereInputSchema),z.lazy(() => ReviewScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  rating: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  comment: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  curriculumId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const RateLimitUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.RateLimitUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => RateLimitWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RateLimitUpdateWithoutUserInputSchema),z.lazy(() => RateLimitUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => RateLimitCreateWithoutUserInputSchema),z.lazy(() => RateLimitUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const RateLimitUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.RateLimitUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => RateLimitWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RateLimitUpdateWithoutUserInputSchema),z.lazy(() => RateLimitUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const RateLimitUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.RateLimitUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => RateLimitScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RateLimitUpdateManyMutationInputSchema),z.lazy(() => RateLimitUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const RateLimitScalarWhereInputSchema: z.ZodType<Prisma.RateLimitScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RateLimitScalarWhereInputSchema),z.lazy(() => RateLimitScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RateLimitScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RateLimitScalarWhereInputSchema),z.lazy(() => RateLimitScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  count: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutCurriculumsInputSchema: z.ZodType<Prisma.UserCreateWithoutCurriculumsInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userProgress: z.lazy(() => UserProgressCreateNestedManyWithoutUserInputSchema).optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutCurriculumsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCurriculumsInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userProgress: z.lazy(() => UserProgressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutCurriculumsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCurriculumsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCurriculumsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCurriculumsInputSchema) ]),
}).strict();

export const CurriculumCreateWithoutForksInputSchema: z.ZodType<Prisma.CurriculumCreateWithoutForksInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCurriculumsInputSchema),
  forkedFrom: z.lazy(() => CurriculumCreateNestedOneWithoutForksInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressCreateNestedManyWithoutCurriculumInputSchema).optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumUncheckedCreateWithoutForksInputSchema: z.ZodType<Prisma.CurriculumUncheckedCreateWithoutForksInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  creatorId: z.string(),
  forkedFromId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userProgress: z.lazy(() => UserProgressUncheckedCreateNestedManyWithoutCurriculumInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumCreateOrConnectWithoutForksInputSchema: z.ZodType<Prisma.CurriculumCreateOrConnectWithoutForksInput> = z.object({
  where: z.lazy(() => CurriculumWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CurriculumCreateWithoutForksInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutForksInputSchema) ]),
}).strict();

export const CurriculumCreateWithoutForkedFromInputSchema: z.ZodType<Prisma.CurriculumCreateWithoutForkedFromInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCurriculumsInputSchema),
  forks: z.lazy(() => CurriculumCreateNestedManyWithoutForkedFromInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressCreateNestedManyWithoutCurriculumInputSchema).optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumUncheckedCreateWithoutForkedFromInputSchema: z.ZodType<Prisma.CurriculumUncheckedCreateWithoutForkedFromInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  creatorId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  forks: z.lazy(() => CurriculumUncheckedCreateNestedManyWithoutForkedFromInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedCreateNestedManyWithoutCurriculumInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumCreateOrConnectWithoutForkedFromInputSchema: z.ZodType<Prisma.CurriculumCreateOrConnectWithoutForkedFromInput> = z.object({
  where: z.lazy(() => CurriculumWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CurriculumCreateWithoutForkedFromInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutForkedFromInputSchema) ]),
}).strict();

export const CurriculumCreateManyForkedFromInputEnvelopeSchema: z.ZodType<Prisma.CurriculumCreateManyForkedFromInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CurriculumCreateManyForkedFromInputSchema),z.lazy(() => CurriculumCreateManyForkedFromInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserProgressCreateWithoutCurriculumInputSchema: z.ZodType<Prisma.UserProgressCreateWithoutCurriculumInput> = z.object({
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  progress: z.number().int().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutUserProgressInputSchema)
}).strict();

export const UserProgressUncheckedCreateWithoutCurriculumInputSchema: z.ZodType<Prisma.UserProgressUncheckedCreateWithoutCurriculumInput> = z.object({
  userId: z.string(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  progress: z.number().int().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserProgressCreateOrConnectWithoutCurriculumInputSchema: z.ZodType<Prisma.UserProgressCreateOrConnectWithoutCurriculumInput> = z.object({
  where: z.lazy(() => UserProgressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserProgressCreateWithoutCurriculumInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutCurriculumInputSchema) ]),
}).strict();

export const UserProgressCreateManyCurriculumInputEnvelopeSchema: z.ZodType<Prisma.UserProgressCreateManyCurriculumInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => UserProgressCreateManyCurriculumInputSchema),z.lazy(() => UserProgressCreateManyCurriculumInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ReviewCreateWithoutCurriculumInputSchema: z.ZodType<Prisma.ReviewCreateWithoutCurriculumInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  comment: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutReviewsInputSchema)
}).strict();

export const ReviewUncheckedCreateWithoutCurriculumInputSchema: z.ZodType<Prisma.ReviewUncheckedCreateWithoutCurriculumInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  comment: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ReviewCreateOrConnectWithoutCurriculumInputSchema: z.ZodType<Prisma.ReviewCreateOrConnectWithoutCurriculumInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ReviewCreateWithoutCurriculumInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutCurriculumInputSchema) ]),
}).strict();

export const ReviewCreateManyCurriculumInputEnvelopeSchema: z.ZodType<Prisma.ReviewCreateManyCurriculumInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ReviewCreateManyCurriculumInputSchema),z.lazy(() => ReviewCreateManyCurriculumInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutCurriculumsInputSchema: z.ZodType<Prisma.UserUpsertWithoutCurriculumsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutCurriculumsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCurriculumsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCurriculumsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCurriculumsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutCurriculumsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCurriculumsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutCurriculumsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCurriculumsInputSchema) ]),
}).strict();

export const UserUpdateWithoutCurriculumsInputSchema: z.ZodType<Prisma.UserUpdateWithoutCurriculumsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userProgress: z.lazy(() => UserProgressUpdateManyWithoutUserNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutCurriculumsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCurriculumsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const CurriculumUpsertWithoutForksInputSchema: z.ZodType<Prisma.CurriculumUpsertWithoutForksInput> = z.object({
  update: z.union([ z.lazy(() => CurriculumUpdateWithoutForksInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutForksInputSchema) ]),
  create: z.union([ z.lazy(() => CurriculumCreateWithoutForksInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutForksInputSchema) ]),
  where: z.lazy(() => CurriculumWhereInputSchema).optional()
}).strict();

export const CurriculumUpdateToOneWithWhereWithoutForksInputSchema: z.ZodType<Prisma.CurriculumUpdateToOneWithWhereWithoutForksInput> = z.object({
  where: z.lazy(() => CurriculumWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CurriculumUpdateWithoutForksInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutForksInputSchema) ]),
}).strict();

export const CurriculumUpdateWithoutForksInputSchema: z.ZodType<Prisma.CurriculumUpdateWithoutForksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCurriculumsNestedInputSchema).optional(),
  forkedFrom: z.lazy(() => CurriculumUpdateOneWithoutForksNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUpdateManyWithoutCurriculumNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const CurriculumUncheckedUpdateWithoutForksInputSchema: z.ZodType<Prisma.CurriculumUncheckedUpdateWithoutForksInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedUpdateManyWithoutCurriculumNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const CurriculumUpsertWithWhereUniqueWithoutForkedFromInputSchema: z.ZodType<Prisma.CurriculumUpsertWithWhereUniqueWithoutForkedFromInput> = z.object({
  where: z.lazy(() => CurriculumWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CurriculumUpdateWithoutForkedFromInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutForkedFromInputSchema) ]),
  create: z.union([ z.lazy(() => CurriculumCreateWithoutForkedFromInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutForkedFromInputSchema) ]),
}).strict();

export const CurriculumUpdateWithWhereUniqueWithoutForkedFromInputSchema: z.ZodType<Prisma.CurriculumUpdateWithWhereUniqueWithoutForkedFromInput> = z.object({
  where: z.lazy(() => CurriculumWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CurriculumUpdateWithoutForkedFromInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutForkedFromInputSchema) ]),
}).strict();

export const CurriculumUpdateManyWithWhereWithoutForkedFromInputSchema: z.ZodType<Prisma.CurriculumUpdateManyWithWhereWithoutForkedFromInput> = z.object({
  where: z.lazy(() => CurriculumScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CurriculumUpdateManyMutationInputSchema),z.lazy(() => CurriculumUncheckedUpdateManyWithoutForkedFromInputSchema) ]),
}).strict();

export const UserProgressUpsertWithWhereUniqueWithoutCurriculumInputSchema: z.ZodType<Prisma.UserProgressUpsertWithWhereUniqueWithoutCurriculumInput> = z.object({
  where: z.lazy(() => UserProgressWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserProgressUpdateWithoutCurriculumInputSchema),z.lazy(() => UserProgressUncheckedUpdateWithoutCurriculumInputSchema) ]),
  create: z.union([ z.lazy(() => UserProgressCreateWithoutCurriculumInputSchema),z.lazy(() => UserProgressUncheckedCreateWithoutCurriculumInputSchema) ]),
}).strict();

export const UserProgressUpdateWithWhereUniqueWithoutCurriculumInputSchema: z.ZodType<Prisma.UserProgressUpdateWithWhereUniqueWithoutCurriculumInput> = z.object({
  where: z.lazy(() => UserProgressWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserProgressUpdateWithoutCurriculumInputSchema),z.lazy(() => UserProgressUncheckedUpdateWithoutCurriculumInputSchema) ]),
}).strict();

export const UserProgressUpdateManyWithWhereWithoutCurriculumInputSchema: z.ZodType<Prisma.UserProgressUpdateManyWithWhereWithoutCurriculumInput> = z.object({
  where: z.lazy(() => UserProgressScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserProgressUpdateManyMutationInputSchema),z.lazy(() => UserProgressUncheckedUpdateManyWithoutCurriculumInputSchema) ]),
}).strict();

export const ReviewUpsertWithWhereUniqueWithoutCurriculumInputSchema: z.ZodType<Prisma.ReviewUpsertWithWhereUniqueWithoutCurriculumInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ReviewUpdateWithoutCurriculumInputSchema),z.lazy(() => ReviewUncheckedUpdateWithoutCurriculumInputSchema) ]),
  create: z.union([ z.lazy(() => ReviewCreateWithoutCurriculumInputSchema),z.lazy(() => ReviewUncheckedCreateWithoutCurriculumInputSchema) ]),
}).strict();

export const ReviewUpdateWithWhereUniqueWithoutCurriculumInputSchema: z.ZodType<Prisma.ReviewUpdateWithWhereUniqueWithoutCurriculumInput> = z.object({
  where: z.lazy(() => ReviewWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ReviewUpdateWithoutCurriculumInputSchema),z.lazy(() => ReviewUncheckedUpdateWithoutCurriculumInputSchema) ]),
}).strict();

export const ReviewUpdateManyWithWhereWithoutCurriculumInputSchema: z.ZodType<Prisma.ReviewUpdateManyWithWhereWithoutCurriculumInput> = z.object({
  where: z.lazy(() => ReviewScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ReviewUpdateManyMutationInputSchema),z.lazy(() => ReviewUncheckedUpdateManyWithoutCurriculumInputSchema) ]),
}).strict();

export const UserCreateWithoutUserProgressInputSchema: z.ZodType<Prisma.UserCreateWithoutUserProgressInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  curriculums: z.lazy(() => CurriculumCreateNestedManyWithoutCreatorInputSchema).optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutUserProgressInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutUserProgressInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  curriculums: z.lazy(() => CurriculumUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutUserProgressInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutUserProgressInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutUserProgressInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserProgressInputSchema) ]),
}).strict();

export const CurriculumCreateWithoutUserProgressInputSchema: z.ZodType<Prisma.CurriculumCreateWithoutUserProgressInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCurriculumsInputSchema),
  forkedFrom: z.lazy(() => CurriculumCreateNestedOneWithoutForksInputSchema).optional(),
  forks: z.lazy(() => CurriculumCreateNestedManyWithoutForkedFromInputSchema).optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumUncheckedCreateWithoutUserProgressInputSchema: z.ZodType<Prisma.CurriculumUncheckedCreateWithoutUserProgressInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  creatorId: z.string(),
  forkedFromId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  forks: z.lazy(() => CurriculumUncheckedCreateNestedManyWithoutForkedFromInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumCreateOrConnectWithoutUserProgressInputSchema: z.ZodType<Prisma.CurriculumCreateOrConnectWithoutUserProgressInput> = z.object({
  where: z.lazy(() => CurriculumWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CurriculumCreateWithoutUserProgressInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutUserProgressInputSchema) ]),
}).strict();

export const UserUpsertWithoutUserProgressInputSchema: z.ZodType<Prisma.UserUpsertWithoutUserProgressInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutUserProgressInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserProgressInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutUserProgressInputSchema),z.lazy(() => UserUncheckedCreateWithoutUserProgressInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutUserProgressInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutUserProgressInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutUserProgressInputSchema),z.lazy(() => UserUncheckedUpdateWithoutUserProgressInputSchema) ]),
}).strict();

export const UserUpdateWithoutUserProgressInputSchema: z.ZodType<Prisma.UserUpdateWithoutUserProgressInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  curriculums: z.lazy(() => CurriculumUpdateManyWithoutCreatorNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutUserProgressInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutUserProgressInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  curriculums: z.lazy(() => CurriculumUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const CurriculumUpsertWithoutUserProgressInputSchema: z.ZodType<Prisma.CurriculumUpsertWithoutUserProgressInput> = z.object({
  update: z.union([ z.lazy(() => CurriculumUpdateWithoutUserProgressInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutUserProgressInputSchema) ]),
  create: z.union([ z.lazy(() => CurriculumCreateWithoutUserProgressInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutUserProgressInputSchema) ]),
  where: z.lazy(() => CurriculumWhereInputSchema).optional()
}).strict();

export const CurriculumUpdateToOneWithWhereWithoutUserProgressInputSchema: z.ZodType<Prisma.CurriculumUpdateToOneWithWhereWithoutUserProgressInput> = z.object({
  where: z.lazy(() => CurriculumWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CurriculumUpdateWithoutUserProgressInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutUserProgressInputSchema) ]),
}).strict();

export const CurriculumUpdateWithoutUserProgressInputSchema: z.ZodType<Prisma.CurriculumUpdateWithoutUserProgressInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCurriculumsNestedInputSchema).optional(),
  forkedFrom: z.lazy(() => CurriculumUpdateOneWithoutForksNestedInputSchema).optional(),
  forks: z.lazy(() => CurriculumUpdateManyWithoutForkedFromNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const CurriculumUncheckedUpdateWithoutUserProgressInputSchema: z.ZodType<Prisma.CurriculumUncheckedUpdateWithoutUserProgressInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  forks: z.lazy(() => CurriculumUncheckedUpdateManyWithoutForkedFromNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutReviewsInputSchema: z.ZodType<Prisma.UserCreateWithoutReviewsInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  curriculums: z.lazy(() => CurriculumCreateNestedManyWithoutCreatorInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressCreateNestedManyWithoutUserInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutReviewsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutReviewsInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  curriculums: z.lazy(() => CurriculumUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutReviewsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutReviewsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutReviewsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReviewsInputSchema) ]),
}).strict();

export const CurriculumCreateWithoutReviewsInputSchema: z.ZodType<Prisma.CurriculumCreateWithoutReviewsInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  creator: z.lazy(() => UserCreateNestedOneWithoutCurriculumsInputSchema),
  forkedFrom: z.lazy(() => CurriculumCreateNestedOneWithoutForksInputSchema).optional(),
  forks: z.lazy(() => CurriculumCreateNestedManyWithoutForkedFromInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumUncheckedCreateWithoutReviewsInputSchema: z.ZodType<Prisma.CurriculumUncheckedCreateWithoutReviewsInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  creatorId: z.string(),
  forkedFromId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  forks: z.lazy(() => CurriculumUncheckedCreateNestedManyWithoutForkedFromInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedCreateNestedManyWithoutCurriculumInputSchema).optional()
}).strict();

export const CurriculumCreateOrConnectWithoutReviewsInputSchema: z.ZodType<Prisma.CurriculumCreateOrConnectWithoutReviewsInput> = z.object({
  where: z.lazy(() => CurriculumWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CurriculumCreateWithoutReviewsInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutReviewsInputSchema) ]),
}).strict();

export const UserUpsertWithoutReviewsInputSchema: z.ZodType<Prisma.UserUpsertWithoutReviewsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutReviewsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReviewsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutReviewsInputSchema),z.lazy(() => UserUncheckedCreateWithoutReviewsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutReviewsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutReviewsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutReviewsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutReviewsInputSchema) ]),
}).strict();

export const UserUpdateWithoutReviewsInputSchema: z.ZodType<Prisma.UserUpdateWithoutReviewsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  curriculums: z.lazy(() => CurriculumUpdateManyWithoutCreatorNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUpdateManyWithoutUserNestedInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutReviewsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutReviewsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  curriculums: z.lazy(() => CurriculumUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  rateLimits: z.lazy(() => RateLimitUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const CurriculumUpsertWithoutReviewsInputSchema: z.ZodType<Prisma.CurriculumUpsertWithoutReviewsInput> = z.object({
  update: z.union([ z.lazy(() => CurriculumUpdateWithoutReviewsInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutReviewsInputSchema) ]),
  create: z.union([ z.lazy(() => CurriculumCreateWithoutReviewsInputSchema),z.lazy(() => CurriculumUncheckedCreateWithoutReviewsInputSchema) ]),
  where: z.lazy(() => CurriculumWhereInputSchema).optional()
}).strict();

export const CurriculumUpdateToOneWithWhereWithoutReviewsInputSchema: z.ZodType<Prisma.CurriculumUpdateToOneWithWhereWithoutReviewsInput> = z.object({
  where: z.lazy(() => CurriculumWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CurriculumUpdateWithoutReviewsInputSchema),z.lazy(() => CurriculumUncheckedUpdateWithoutReviewsInputSchema) ]),
}).strict();

export const CurriculumUpdateWithoutReviewsInputSchema: z.ZodType<Prisma.CurriculumUpdateWithoutReviewsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCurriculumsNestedInputSchema).optional(),
  forkedFrom: z.lazy(() => CurriculumUpdateOneWithoutForksNestedInputSchema).optional(),
  forks: z.lazy(() => CurriculumUpdateManyWithoutForkedFromNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const CurriculumUncheckedUpdateWithoutReviewsInputSchema: z.ZodType<Prisma.CurriculumUncheckedUpdateWithoutReviewsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  forks: z.lazy(() => CurriculumUncheckedUpdateManyWithoutForkedFromNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutRateLimitsInputSchema: z.ZodType<Prisma.UserCreateWithoutRateLimitsInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  curriculums: z.lazy(() => CurriculumCreateNestedManyWithoutCreatorInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressCreateNestedManyWithoutUserInputSchema).optional(),
  reviews: z.lazy(() => ReviewCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutRateLimitsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutRateLimitsInput> = z.object({
  id: z.string(),
  clerkId: z.string(),
  email: z.string(),
  username: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  curriculums: z.lazy(() => CurriculumUncheckedCreateNestedManyWithoutCreatorInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutRateLimitsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutRateLimitsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutRateLimitsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRateLimitsInputSchema) ]),
}).strict();

export const UserUpsertWithoutRateLimitsInputSchema: z.ZodType<Prisma.UserUpsertWithoutRateLimitsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutRateLimitsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRateLimitsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutRateLimitsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRateLimitsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutRateLimitsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutRateLimitsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutRateLimitsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRateLimitsInputSchema) ]),
}).strict();

export const UserUpdateWithoutRateLimitsInputSchema: z.ZodType<Prisma.UserUpdateWithoutRateLimitsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  curriculums: z.lazy(() => CurriculumUpdateManyWithoutCreatorNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUpdateManyWithoutUserNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutRateLimitsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutRateLimitsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  clerkId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  curriculums: z.lazy(() => CurriculumUncheckedUpdateManyWithoutCreatorNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const CurriculumCreateManyCreatorInputSchema: z.ZodType<Prisma.CurriculumCreateManyCreatorInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  forkedFromId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserProgressCreateManyUserInputSchema: z.ZodType<Prisma.UserProgressCreateManyUserInput> = z.object({
  curriculumId: z.string(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  progress: z.number().int().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ReviewCreateManyUserInputSchema: z.ZodType<Prisma.ReviewCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  comment: z.string().optional().nullable(),
  curriculumId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RateLimitCreateManyUserInputSchema: z.ZodType<Prisma.RateLimitCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  date: z.string(),
  count: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CurriculumUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.CurriculumUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFrom: z.lazy(() => CurriculumUpdateOneWithoutForksNestedInputSchema).optional(),
  forks: z.lazy(() => CurriculumUpdateManyWithoutForkedFromNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUpdateManyWithoutCurriculumNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const CurriculumUncheckedUpdateWithoutCreatorInputSchema: z.ZodType<Prisma.CurriculumUncheckedUpdateWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  forks: z.lazy(() => CurriculumUncheckedUpdateManyWithoutForkedFromNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedUpdateManyWithoutCurriculumNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const CurriculumUncheckedUpdateManyWithoutCreatorInputSchema: z.ZodType<Prisma.CurriculumUncheckedUpdateManyWithoutCreatorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  forkedFromId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserProgressUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserProgressUpdateWithoutUserInput> = z.object({
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  progress: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  curriculum: z.lazy(() => CurriculumUpdateOneRequiredWithoutUserProgressNestedInputSchema).optional()
}).strict();

export const UserProgressUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.UserProgressUncheckedUpdateWithoutUserInput> = z.object({
  curriculumId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  progress: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserProgressUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.UserProgressUncheckedUpdateManyWithoutUserInput> = z.object({
  curriculumId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  progress: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReviewUpdateWithoutUserInputSchema: z.ZodType<Prisma.ReviewUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  curriculum: z.lazy(() => CurriculumUpdateOneRequiredWithoutReviewsNestedInputSchema).optional()
}).strict();

export const ReviewUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  curriculumId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReviewUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  curriculumId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RateLimitUpdateWithoutUserInputSchema: z.ZodType<Prisma.RateLimitUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  count: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RateLimitUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.RateLimitUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  count: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RateLimitUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.RateLimitUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  count: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CurriculumCreateManyForkedFromInputSchema: z.ZodType<Prisma.CurriculumCreateManyForkedFromInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  domain: z.string(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isPublic: z.boolean().optional(),
  forkCount: z.number().int().optional(),
  creatorId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserProgressCreateManyCurriculumInputSchema: z.ZodType<Prisma.UserProgressCreateManyCurriculumInput> = z.object({
  userId: z.string(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  progress: z.number().int().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ReviewCreateManyCurriculumInputSchema: z.ZodType<Prisma.ReviewCreateManyCurriculumInput> = z.object({
  id: z.string().cuid().optional(),
  rating: z.number().int(),
  comment: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CurriculumUpdateWithoutForkedFromInputSchema: z.ZodType<Prisma.CurriculumUpdateWithoutForkedFromInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  creator: z.lazy(() => UserUpdateOneRequiredWithoutCurriculumsNestedInputSchema).optional(),
  forks: z.lazy(() => CurriculumUpdateManyWithoutForkedFromNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUpdateManyWithoutCurriculumNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const CurriculumUncheckedUpdateWithoutForkedFromInputSchema: z.ZodType<Prisma.CurriculumUncheckedUpdateWithoutForkedFromInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  forks: z.lazy(() => CurriculumUncheckedUpdateManyWithoutForkedFromNestedInputSchema).optional(),
  userProgress: z.lazy(() => UserProgressUncheckedUpdateManyWithoutCurriculumNestedInputSchema).optional(),
  reviews: z.lazy(() => ReviewUncheckedUpdateManyWithoutCurriculumNestedInputSchema).optional()
}).strict();

export const CurriculumUncheckedUpdateManyWithoutForkedFromInputSchema: z.ZodType<Prisma.CurriculumUncheckedUpdateManyWithoutForkedFromInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  domain: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isPublic: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  forkCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  creatorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserProgressUpdateWithoutCurriculumInputSchema: z.ZodType<Prisma.UserProgressUpdateWithoutCurriculumInput> = z.object({
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  progress: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutUserProgressNestedInputSchema).optional()
}).strict();

export const UserProgressUncheckedUpdateWithoutCurriculumInputSchema: z.ZodType<Prisma.UserProgressUncheckedUpdateWithoutCurriculumInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  progress: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserProgressUncheckedUpdateManyWithoutCurriculumInputSchema: z.ZodType<Prisma.UserProgressUncheckedUpdateManyWithoutCurriculumInput> = z.object({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  completedSteps: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  progress: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReviewUpdateWithoutCurriculumInputSchema: z.ZodType<Prisma.ReviewUpdateWithoutCurriculumInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutReviewsNestedInputSchema).optional()
}).strict();

export const ReviewUncheckedUpdateWithoutCurriculumInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateWithoutCurriculumInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ReviewUncheckedUpdateManyWithoutCurriculumInputSchema: z.ZodType<Prisma.ReviewUncheckedUpdateManyWithoutCurriculumInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  rating: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const CurriculumFindFirstArgsSchema: z.ZodType<Prisma.CurriculumFindFirstArgs> = z.object({
  select: CurriculumSelectSchema.optional(),
  include: CurriculumIncludeSchema.optional(),
  where: CurriculumWhereInputSchema.optional(),
  orderBy: z.union([ CurriculumOrderByWithRelationInputSchema.array(),CurriculumOrderByWithRelationInputSchema ]).optional(),
  cursor: CurriculumWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CurriculumScalarFieldEnumSchema,CurriculumScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CurriculumFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CurriculumFindFirstOrThrowArgs> = z.object({
  select: CurriculumSelectSchema.optional(),
  include: CurriculumIncludeSchema.optional(),
  where: CurriculumWhereInputSchema.optional(),
  orderBy: z.union([ CurriculumOrderByWithRelationInputSchema.array(),CurriculumOrderByWithRelationInputSchema ]).optional(),
  cursor: CurriculumWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CurriculumScalarFieldEnumSchema,CurriculumScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CurriculumFindManyArgsSchema: z.ZodType<Prisma.CurriculumFindManyArgs> = z.object({
  select: CurriculumSelectSchema.optional(),
  include: CurriculumIncludeSchema.optional(),
  where: CurriculumWhereInputSchema.optional(),
  orderBy: z.union([ CurriculumOrderByWithRelationInputSchema.array(),CurriculumOrderByWithRelationInputSchema ]).optional(),
  cursor: CurriculumWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CurriculumScalarFieldEnumSchema,CurriculumScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CurriculumAggregateArgsSchema: z.ZodType<Prisma.CurriculumAggregateArgs> = z.object({
  where: CurriculumWhereInputSchema.optional(),
  orderBy: z.union([ CurriculumOrderByWithRelationInputSchema.array(),CurriculumOrderByWithRelationInputSchema ]).optional(),
  cursor: CurriculumWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CurriculumGroupByArgsSchema: z.ZodType<Prisma.CurriculumGroupByArgs> = z.object({
  where: CurriculumWhereInputSchema.optional(),
  orderBy: z.union([ CurriculumOrderByWithAggregationInputSchema.array(),CurriculumOrderByWithAggregationInputSchema ]).optional(),
  by: CurriculumScalarFieldEnumSchema.array(),
  having: CurriculumScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CurriculumFindUniqueArgsSchema: z.ZodType<Prisma.CurriculumFindUniqueArgs> = z.object({
  select: CurriculumSelectSchema.optional(),
  include: CurriculumIncludeSchema.optional(),
  where: CurriculumWhereUniqueInputSchema,
}).strict() ;

export const CurriculumFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CurriculumFindUniqueOrThrowArgs> = z.object({
  select: CurriculumSelectSchema.optional(),
  include: CurriculumIncludeSchema.optional(),
  where: CurriculumWhereUniqueInputSchema,
}).strict() ;

export const UserProgressFindFirstArgsSchema: z.ZodType<Prisma.UserProgressFindFirstArgs> = z.object({
  select: UserProgressSelectSchema.optional(),
  include: UserProgressIncludeSchema.optional(),
  where: UserProgressWhereInputSchema.optional(),
  orderBy: z.union([ UserProgressOrderByWithRelationInputSchema.array(),UserProgressOrderByWithRelationInputSchema ]).optional(),
  cursor: UserProgressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserProgressScalarFieldEnumSchema,UserProgressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserProgressFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserProgressFindFirstOrThrowArgs> = z.object({
  select: UserProgressSelectSchema.optional(),
  include: UserProgressIncludeSchema.optional(),
  where: UserProgressWhereInputSchema.optional(),
  orderBy: z.union([ UserProgressOrderByWithRelationInputSchema.array(),UserProgressOrderByWithRelationInputSchema ]).optional(),
  cursor: UserProgressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserProgressScalarFieldEnumSchema,UserProgressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserProgressFindManyArgsSchema: z.ZodType<Prisma.UserProgressFindManyArgs> = z.object({
  select: UserProgressSelectSchema.optional(),
  include: UserProgressIncludeSchema.optional(),
  where: UserProgressWhereInputSchema.optional(),
  orderBy: z.union([ UserProgressOrderByWithRelationInputSchema.array(),UserProgressOrderByWithRelationInputSchema ]).optional(),
  cursor: UserProgressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserProgressScalarFieldEnumSchema,UserProgressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserProgressAggregateArgsSchema: z.ZodType<Prisma.UserProgressAggregateArgs> = z.object({
  where: UserProgressWhereInputSchema.optional(),
  orderBy: z.union([ UserProgressOrderByWithRelationInputSchema.array(),UserProgressOrderByWithRelationInputSchema ]).optional(),
  cursor: UserProgressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserProgressGroupByArgsSchema: z.ZodType<Prisma.UserProgressGroupByArgs> = z.object({
  where: UserProgressWhereInputSchema.optional(),
  orderBy: z.union([ UserProgressOrderByWithAggregationInputSchema.array(),UserProgressOrderByWithAggregationInputSchema ]).optional(),
  by: UserProgressScalarFieldEnumSchema.array(),
  having: UserProgressScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserProgressFindUniqueArgsSchema: z.ZodType<Prisma.UserProgressFindUniqueArgs> = z.object({
  select: UserProgressSelectSchema.optional(),
  include: UserProgressIncludeSchema.optional(),
  where: UserProgressWhereUniqueInputSchema,
}).strict() ;

export const UserProgressFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserProgressFindUniqueOrThrowArgs> = z.object({
  select: UserProgressSelectSchema.optional(),
  include: UserProgressIncludeSchema.optional(),
  where: UserProgressWhereUniqueInputSchema,
}).strict() ;

export const ReviewFindFirstArgsSchema: z.ZodType<Prisma.ReviewFindFirstArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereInputSchema.optional(),
  orderBy: z.union([ ReviewOrderByWithRelationInputSchema.array(),ReviewOrderByWithRelationInputSchema ]).optional(),
  cursor: ReviewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReviewScalarFieldEnumSchema,ReviewScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReviewFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ReviewFindFirstOrThrowArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereInputSchema.optional(),
  orderBy: z.union([ ReviewOrderByWithRelationInputSchema.array(),ReviewOrderByWithRelationInputSchema ]).optional(),
  cursor: ReviewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReviewScalarFieldEnumSchema,ReviewScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReviewFindManyArgsSchema: z.ZodType<Prisma.ReviewFindManyArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereInputSchema.optional(),
  orderBy: z.union([ ReviewOrderByWithRelationInputSchema.array(),ReviewOrderByWithRelationInputSchema ]).optional(),
  cursor: ReviewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ReviewScalarFieldEnumSchema,ReviewScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ReviewAggregateArgsSchema: z.ZodType<Prisma.ReviewAggregateArgs> = z.object({
  where: ReviewWhereInputSchema.optional(),
  orderBy: z.union([ ReviewOrderByWithRelationInputSchema.array(),ReviewOrderByWithRelationInputSchema ]).optional(),
  cursor: ReviewWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReviewGroupByArgsSchema: z.ZodType<Prisma.ReviewGroupByArgs> = z.object({
  where: ReviewWhereInputSchema.optional(),
  orderBy: z.union([ ReviewOrderByWithAggregationInputSchema.array(),ReviewOrderByWithAggregationInputSchema ]).optional(),
  by: ReviewScalarFieldEnumSchema.array(),
  having: ReviewScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ReviewFindUniqueArgsSchema: z.ZodType<Prisma.ReviewFindUniqueArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereUniqueInputSchema,
}).strict() ;

export const ReviewFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ReviewFindUniqueOrThrowArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereUniqueInputSchema,
}).strict() ;

export const RateLimitFindFirstArgsSchema: z.ZodType<Prisma.RateLimitFindFirstArgs> = z.object({
  select: RateLimitSelectSchema.optional(),
  include: RateLimitIncludeSchema.optional(),
  where: RateLimitWhereInputSchema.optional(),
  orderBy: z.union([ RateLimitOrderByWithRelationInputSchema.array(),RateLimitOrderByWithRelationInputSchema ]).optional(),
  cursor: RateLimitWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RateLimitScalarFieldEnumSchema,RateLimitScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RateLimitFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RateLimitFindFirstOrThrowArgs> = z.object({
  select: RateLimitSelectSchema.optional(),
  include: RateLimitIncludeSchema.optional(),
  where: RateLimitWhereInputSchema.optional(),
  orderBy: z.union([ RateLimitOrderByWithRelationInputSchema.array(),RateLimitOrderByWithRelationInputSchema ]).optional(),
  cursor: RateLimitWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RateLimitScalarFieldEnumSchema,RateLimitScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RateLimitFindManyArgsSchema: z.ZodType<Prisma.RateLimitFindManyArgs> = z.object({
  select: RateLimitSelectSchema.optional(),
  include: RateLimitIncludeSchema.optional(),
  where: RateLimitWhereInputSchema.optional(),
  orderBy: z.union([ RateLimitOrderByWithRelationInputSchema.array(),RateLimitOrderByWithRelationInputSchema ]).optional(),
  cursor: RateLimitWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RateLimitScalarFieldEnumSchema,RateLimitScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RateLimitAggregateArgsSchema: z.ZodType<Prisma.RateLimitAggregateArgs> = z.object({
  where: RateLimitWhereInputSchema.optional(),
  orderBy: z.union([ RateLimitOrderByWithRelationInputSchema.array(),RateLimitOrderByWithRelationInputSchema ]).optional(),
  cursor: RateLimitWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RateLimitGroupByArgsSchema: z.ZodType<Prisma.RateLimitGroupByArgs> = z.object({
  where: RateLimitWhereInputSchema.optional(),
  orderBy: z.union([ RateLimitOrderByWithAggregationInputSchema.array(),RateLimitOrderByWithAggregationInputSchema ]).optional(),
  by: RateLimitScalarFieldEnumSchema.array(),
  having: RateLimitScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RateLimitFindUniqueArgsSchema: z.ZodType<Prisma.RateLimitFindUniqueArgs> = z.object({
  select: RateLimitSelectSchema.optional(),
  include: RateLimitIncludeSchema.optional(),
  where: RateLimitWhereUniqueInputSchema,
}).strict() ;

export const RateLimitFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RateLimitFindUniqueOrThrowArgs> = z.object({
  select: RateLimitSelectSchema.optional(),
  include: RateLimitIncludeSchema.optional(),
  where: RateLimitWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CurriculumCreateArgsSchema: z.ZodType<Prisma.CurriculumCreateArgs> = z.object({
  select: CurriculumSelectSchema.optional(),
  include: CurriculumIncludeSchema.optional(),
  data: z.union([ CurriculumCreateInputSchema,CurriculumUncheckedCreateInputSchema ]),
}).strict() ;

export const CurriculumUpsertArgsSchema: z.ZodType<Prisma.CurriculumUpsertArgs> = z.object({
  select: CurriculumSelectSchema.optional(),
  include: CurriculumIncludeSchema.optional(),
  where: CurriculumWhereUniqueInputSchema,
  create: z.union([ CurriculumCreateInputSchema,CurriculumUncheckedCreateInputSchema ]),
  update: z.union([ CurriculumUpdateInputSchema,CurriculumUncheckedUpdateInputSchema ]),
}).strict() ;

export const CurriculumCreateManyArgsSchema: z.ZodType<Prisma.CurriculumCreateManyArgs> = z.object({
  data: z.union([ CurriculumCreateManyInputSchema,CurriculumCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CurriculumCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CurriculumCreateManyAndReturnArgs> = z.object({
  data: z.union([ CurriculumCreateManyInputSchema,CurriculumCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CurriculumDeleteArgsSchema: z.ZodType<Prisma.CurriculumDeleteArgs> = z.object({
  select: CurriculumSelectSchema.optional(),
  include: CurriculumIncludeSchema.optional(),
  where: CurriculumWhereUniqueInputSchema,
}).strict() ;

export const CurriculumUpdateArgsSchema: z.ZodType<Prisma.CurriculumUpdateArgs> = z.object({
  select: CurriculumSelectSchema.optional(),
  include: CurriculumIncludeSchema.optional(),
  data: z.union([ CurriculumUpdateInputSchema,CurriculumUncheckedUpdateInputSchema ]),
  where: CurriculumWhereUniqueInputSchema,
}).strict() ;

export const CurriculumUpdateManyArgsSchema: z.ZodType<Prisma.CurriculumUpdateManyArgs> = z.object({
  data: z.union([ CurriculumUpdateManyMutationInputSchema,CurriculumUncheckedUpdateManyInputSchema ]),
  where: CurriculumWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CurriculumUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CurriculumUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CurriculumUpdateManyMutationInputSchema,CurriculumUncheckedUpdateManyInputSchema ]),
  where: CurriculumWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CurriculumDeleteManyArgsSchema: z.ZodType<Prisma.CurriculumDeleteManyArgs> = z.object({
  where: CurriculumWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserProgressCreateArgsSchema: z.ZodType<Prisma.UserProgressCreateArgs> = z.object({
  select: UserProgressSelectSchema.optional(),
  include: UserProgressIncludeSchema.optional(),
  data: z.union([ UserProgressCreateInputSchema,UserProgressUncheckedCreateInputSchema ]),
}).strict() ;

export const UserProgressUpsertArgsSchema: z.ZodType<Prisma.UserProgressUpsertArgs> = z.object({
  select: UserProgressSelectSchema.optional(),
  include: UserProgressIncludeSchema.optional(),
  where: UserProgressWhereUniqueInputSchema,
  create: z.union([ UserProgressCreateInputSchema,UserProgressUncheckedCreateInputSchema ]),
  update: z.union([ UserProgressUpdateInputSchema,UserProgressUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserProgressCreateManyArgsSchema: z.ZodType<Prisma.UserProgressCreateManyArgs> = z.object({
  data: z.union([ UserProgressCreateManyInputSchema,UserProgressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserProgressCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserProgressCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserProgressCreateManyInputSchema,UserProgressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserProgressDeleteArgsSchema: z.ZodType<Prisma.UserProgressDeleteArgs> = z.object({
  select: UserProgressSelectSchema.optional(),
  include: UserProgressIncludeSchema.optional(),
  where: UserProgressWhereUniqueInputSchema,
}).strict() ;

export const UserProgressUpdateArgsSchema: z.ZodType<Prisma.UserProgressUpdateArgs> = z.object({
  select: UserProgressSelectSchema.optional(),
  include: UserProgressIncludeSchema.optional(),
  data: z.union([ UserProgressUpdateInputSchema,UserProgressUncheckedUpdateInputSchema ]),
  where: UserProgressWhereUniqueInputSchema,
}).strict() ;

export const UserProgressUpdateManyArgsSchema: z.ZodType<Prisma.UserProgressUpdateManyArgs> = z.object({
  data: z.union([ UserProgressUpdateManyMutationInputSchema,UserProgressUncheckedUpdateManyInputSchema ]),
  where: UserProgressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserProgressUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserProgressUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserProgressUpdateManyMutationInputSchema,UserProgressUncheckedUpdateManyInputSchema ]),
  where: UserProgressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserProgressDeleteManyArgsSchema: z.ZodType<Prisma.UserProgressDeleteManyArgs> = z.object({
  where: UserProgressWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReviewCreateArgsSchema: z.ZodType<Prisma.ReviewCreateArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  data: z.union([ ReviewCreateInputSchema,ReviewUncheckedCreateInputSchema ]),
}).strict() ;

export const ReviewUpsertArgsSchema: z.ZodType<Prisma.ReviewUpsertArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereUniqueInputSchema,
  create: z.union([ ReviewCreateInputSchema,ReviewUncheckedCreateInputSchema ]),
  update: z.union([ ReviewUpdateInputSchema,ReviewUncheckedUpdateInputSchema ]),
}).strict() ;

export const ReviewCreateManyArgsSchema: z.ZodType<Prisma.ReviewCreateManyArgs> = z.object({
  data: z.union([ ReviewCreateManyInputSchema,ReviewCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ReviewCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ReviewCreateManyAndReturnArgs> = z.object({
  data: z.union([ ReviewCreateManyInputSchema,ReviewCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ReviewDeleteArgsSchema: z.ZodType<Prisma.ReviewDeleteArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  where: ReviewWhereUniqueInputSchema,
}).strict() ;

export const ReviewUpdateArgsSchema: z.ZodType<Prisma.ReviewUpdateArgs> = z.object({
  select: ReviewSelectSchema.optional(),
  include: ReviewIncludeSchema.optional(),
  data: z.union([ ReviewUpdateInputSchema,ReviewUncheckedUpdateInputSchema ]),
  where: ReviewWhereUniqueInputSchema,
}).strict() ;

export const ReviewUpdateManyArgsSchema: z.ZodType<Prisma.ReviewUpdateManyArgs> = z.object({
  data: z.union([ ReviewUpdateManyMutationInputSchema,ReviewUncheckedUpdateManyInputSchema ]),
  where: ReviewWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReviewUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ReviewUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ReviewUpdateManyMutationInputSchema,ReviewUncheckedUpdateManyInputSchema ]),
  where: ReviewWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ReviewDeleteManyArgsSchema: z.ZodType<Prisma.ReviewDeleteManyArgs> = z.object({
  where: ReviewWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RateLimitCreateArgsSchema: z.ZodType<Prisma.RateLimitCreateArgs> = z.object({
  select: RateLimitSelectSchema.optional(),
  include: RateLimitIncludeSchema.optional(),
  data: z.union([ RateLimitCreateInputSchema,RateLimitUncheckedCreateInputSchema ]),
}).strict() ;

export const RateLimitUpsertArgsSchema: z.ZodType<Prisma.RateLimitUpsertArgs> = z.object({
  select: RateLimitSelectSchema.optional(),
  include: RateLimitIncludeSchema.optional(),
  where: RateLimitWhereUniqueInputSchema,
  create: z.union([ RateLimitCreateInputSchema,RateLimitUncheckedCreateInputSchema ]),
  update: z.union([ RateLimitUpdateInputSchema,RateLimitUncheckedUpdateInputSchema ]),
}).strict() ;

export const RateLimitCreateManyArgsSchema: z.ZodType<Prisma.RateLimitCreateManyArgs> = z.object({
  data: z.union([ RateLimitCreateManyInputSchema,RateLimitCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RateLimitCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RateLimitCreateManyAndReturnArgs> = z.object({
  data: z.union([ RateLimitCreateManyInputSchema,RateLimitCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RateLimitDeleteArgsSchema: z.ZodType<Prisma.RateLimitDeleteArgs> = z.object({
  select: RateLimitSelectSchema.optional(),
  include: RateLimitIncludeSchema.optional(),
  where: RateLimitWhereUniqueInputSchema,
}).strict() ;

export const RateLimitUpdateArgsSchema: z.ZodType<Prisma.RateLimitUpdateArgs> = z.object({
  select: RateLimitSelectSchema.optional(),
  include: RateLimitIncludeSchema.optional(),
  data: z.union([ RateLimitUpdateInputSchema,RateLimitUncheckedUpdateInputSchema ]),
  where: RateLimitWhereUniqueInputSchema,
}).strict() ;

export const RateLimitUpdateManyArgsSchema: z.ZodType<Prisma.RateLimitUpdateManyArgs> = z.object({
  data: z.union([ RateLimitUpdateManyMutationInputSchema,RateLimitUncheckedUpdateManyInputSchema ]),
  where: RateLimitWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RateLimitUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.RateLimitUpdateManyAndReturnArgs> = z.object({
  data: z.union([ RateLimitUpdateManyMutationInputSchema,RateLimitUncheckedUpdateManyInputSchema ]),
  where: RateLimitWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RateLimitDeleteManyArgsSchema: z.ZodType<Prisma.RateLimitDeleteManyArgs> = z.object({
  where: RateLimitWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;